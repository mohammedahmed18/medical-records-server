import { PrismaService } from '../database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as argon from 'argon2';
import { PUBLIC_FIELDS } from 'src/constants';
import { Prisma } from '@prisma/client';
import { Gender, UserProfile, User } from 'src/graphql';
import { CreateUserInput } from 'src/graphql/createUserInput.schema';
@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}

  async findById(userId: string, select: Prisma.UserSelect) {
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

  async createUser(userData: CreateUserInput): Promise<string> {
    const hash = await argon.hash(userData.password);
    delete userData.password;
    const user = await this.db.user.create({
      data: {
        ...userData,
        gender: Gender[userData.gender],
        password: hash,
        dob: new Date(userData.dob),
      },
      select: PUBLIC_FIELDS,
    });

    return `done 👍 , user ${user.name} is created`;
  }

  //   FIXME: dev only
  async getAll(take?: number, skip?: number): Promise<Partial<UserProfile>[]> {
    const users = await this.db.user.findMany({
      select: PUBLIC_FIELDS,
      take,
      skip,
    });
    return users.map(this.mapUserToProfile);
  }

  mapUserToProfile(user: Partial<User>): Partial<UserProfile> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { educationalLevel, employmentStatus, maritalStatus, ...rest } = user;

    const userProfile: Partial<UserProfile> = Object.assign({}, rest);

    userProfile.employmentStatus = user.employmentStatus.label;
    userProfile.maritalStatus = user.maritalStatus.label;
    userProfile.educationalLevel = user.educationalLevel.label;

    return userProfile;
  }

  async loggedInUserProfile(userId: string): Promise<Partial<UserProfile>> {
    const user = await this.findById(userId, PUBLIC_FIELDS);
    if (!user) throw new NotFoundException('no user found');
    return this.mapUserToProfile(user);
  }
}
