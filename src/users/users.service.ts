import { PrismaService } from '../database/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as argon from 'argon2';
import { PUBLIC_FIELDS } from 'src/constants';
import { Prisma } from '@prisma/client';
import { PublicUser } from 'src/common/types';
@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}

  async findById(userId: string, select: Prisma.UserSelect) {
    const user = await this.db.user.findFirst({
      where: { id: userId },
      select,
    });
    if (user) {
      return user;
    }
    return null;
  }

  async findByNationalId(nationalId: string) {
    const user = await this.db.user.findFirst({
      where: { nationalId },
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

  async createUser(userData: Prisma.UserCreateInput): Promise<string> {
    const hash = await argon.hash(userData.password);
    delete userData.password;
    await this.db.user.create({
      data: { ...userData, password: hash, dob: new Date(userData.dob) },
      // select : PUBLIC_FIELDS
    });

    return 'done 👍';
  }

  //   FIXME: dev only
  async getAll(take?: number, skip?: number): Promise<Partial<PublicUser>[]> {
    const users = await this.db.user.findMany({
      select: PUBLIC_FIELDS,
      take,
      skip,
    });
    return users.map(this.mapUserToProfile);
  }

  mapUserToProfile(user): Partial<PublicUser> {
    const mappedUser = Object.assign({}, user);
    mappedUser['employmentStatus'] = user.employmentStatus.label;
    mappedUser['maritalStatus'] = user.maritalStatus.label;
    mappedUser['educationalLevel'] = user.educationalLevel.label;
    return mappedUser;
  }

  async loggedInUserProfile(
    userId: string,
  ): Promise<Partial<PublicUser> | null> {
    const user: any = await this.findById(userId, PUBLIC_FIELDS);
    if (!user) throw new BadRequestException('no user found');
    return this.mapUserToProfile(user);
  }
}
