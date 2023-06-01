import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { BASE_IMAGE_SIZE, PUBLIC_FIELDS } from 'src/constants';
import { MedicalSpecialization, Prisma } from '@prisma/client';
import { Gender, UserProfile, User } from 'src/graphql';
import { CreateUserInput } from 'src/graphql/createUserInput.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { squarizeImage } from 'src/utils/resizeCloudinaryImage';
import { CacheService } from 'src/redis/cache.service';
import { getUserCachedInfo } from 'src/utils/cacheKeys';
import { CachedUserInfo } from 'src/common/types';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: PrismaService,
    private readonly cache: CacheService,
    private readonly cloudinaryService: CloudinaryService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async findById(userId: string, select: Prisma.UserSelect = null) {
    //TODO: use custom type for this to avoid any unpredicted prisma issues
    const user = await this.db.user.findFirst({
      where: { id: userId },
      select,
    });
    if (user) {
      return user;
    }
    return null;
  }

  async findByNationalId(nationalId: string, select: Prisma.UserSelect = null) {
    const user = await this.db.user.findFirst({
      where: { nationalId },
      select,
    });
    if (user) {
      return user;
    }
    return null;
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async createUser(userData: CreateUserInput): Promise<string> {
    const hash = await argon.hash(userData.password);
    delete userData.password;
    let image_src = '/images/default-user.png';

    if (userData.gender === Gender.Male && !userData.medicalSpecialization) {
      image_src = '/images/avatars/male-icon.png';
    } else if (
      userData.gender === Gender.Male &&
      userData.medicalSpecialization
    ) {
      image_src = '/images/avatars/male-doctor-icon.png';
    } else if (
      userData.gender === Gender.Female &&
      !userData.medicalSpecialization
    ) {
      image_src = '/images/avatars/female-icon.png';
    } else if (
      userData.gender === Gender.Female &&
      userData.medicalSpecialization
    ) {
      image_src = '/images/avatars/female-doctor-icon.png';
    }

    const user = await this.db.user.create({
      data: {
        ...userData,
        gender: Gender[userData.gender],
        password: hash,
        dob: new Date(userData.dob),
        image_src,
      },
      select: PUBLIC_FIELDS,
    });

    return `done 👍 , user ${user.name} is created`;
  }

  async getAll(take?: number, skip?: number): Promise<Partial<UserProfile>[]> {
    const users = await this.db.user.findMany({
      select: PUBLIC_FIELDS,
      take,
      skip,
    });
    return users.map(this.mapUserToProfile);
  }

  async makeDoctor(
    nationalId: string,
    medicalSpecialization: MedicalSpecialization,
  ) {
    const updatedDoctor = await this.db.user.update({
      where: {
        nationalId,
      },
      data: {
        medicalSpecialization,
      },
    });

    if (!updatedDoctor) return 'no user found';
    return 'done user is now doctor';
  }

  async getUserDetailsForOtherUsers(userId: string) {
    const user = await this.findById(userId, {
      medicalSpecialization: true,
      name: true,
      image_src: true,
      id: true,
    });
    if (!user) throw new NotFoundException('No User Found');
    return { user };
  }

  mapUserToProfile(user: Partial<User>): Partial<UserProfile> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { educationalLevel, employmentStatus, maritalStatus, ...rest } = user;

    const userProfile: Partial<UserProfile> = Object.assign({}, rest);

    userProfile.employmentStatus = user.employmentStatus.label;
    userProfile.maritalStatus = user.maritalStatus.label;
    userProfile.educationalLevel = user.educationalLevel.label;
    userProfile.image_src = squarizeImage(user.image_src, BASE_IMAGE_SIZE);
    return userProfile;
  }

  async loggedInUserProfile(userId: string): Promise<Partial<UserProfile>> {
    const user = await this.findById(userId, PUBLIC_FIELDS);
    if (!user) throw new NotFoundException('no user found');
    return this.mapUserToProfile(user);
  }

  async uploadUserProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    if (!userId) throw new BadRequestException('userId is required');
    if (!file) throw new BadRequestException('image is not provided');

    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('user not found');

    if (user.image_src) {
      // delete the prev image from cloudinary
      // we don't want to use await here to not block the code
      this.cloudinaryService.deleteImage(user.image_src);
    }
    const image_url: string = await this.cloudinaryService
      .uploadImage(file)
      .catch((err) => {
        throw new BadRequestException(err.message); //TODO: remove the message as it shows sesitive info about the code
      })
      .then((response) => {
        return response.url; //return the image url
      });

    await this.db.user.update({
      data: { image_src: image_url },
      where: { id: userId },
    });
    // update the cache
    const userCacheKey = getUserCachedInfo(userId);
    const cachedInfo = await this.cache.get<CachedUserInfo>(userCacheKey);
    if (!cachedInfo) {
      // TODO: make columns of the db constants
      await this.cache.set<CachedUserInfo>(userCacheKey, {
        image_src: image_url,
      });
    } else {
      await this.cache.set<CachedUserInfo>(userCacheKey, {
        ...cachedInfo,
        image_src: image_url,
      });
    }
    return image_url;
  }

  async generateHashedQrCode(user: User) {
    const token = await this.jwt.signAsync(
      {
        nationalId: user.nationalId,
        id: user.id,
        name: user.name,
      },
      {
        secret: this.config.get('QR_SECRET'),
        // TODO: uncomment this line when done testing
        // expiresIn: QR_LIFETIME,
      },
    );

    return { qrCode: token };
  }
}
