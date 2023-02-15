import { PrismaService } from '../database/prisma.service';
import { Injectable} from '@nestjs/common';
import * as argon from 'argon2';
import { PUBLIC_FIELDS } from 'src/constants';
import {Prisma} from '@prisma/client'
import { PublicUser } from 'src/common/types';
@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}

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

  async createUser(userData: Prisma.UserCreateInput) : Promise<PublicUser | null> {
    const hash = await argon.hash(userData.password);
    delete userData.password
    const user : any = await this.db.user.create({
        data: {...userData, password : hash , dob : new Date(userData.dob)},
        select : PUBLIC_FIELDS

      });

      return user;
  }

  //   FIXME: dev only
  async getAll(take?: number, skip?: number) : Promise<PublicUser[]> {
    const users : any[] = await this.db.user.findMany({
      select: PUBLIC_FIELDS,
      take,
      skip,
    });
    return users;
  }

  async loggedInUserProfile(currentUser) : Promise<PublicUser>{
    return currentUser
  }
}
