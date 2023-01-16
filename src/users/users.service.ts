import { error_msgs } from './../constants/errors';
import { prismaErrors } from './../constants/prisma-errors';
import { User } from './../common/types/index';
import { PrismaService } from './../prisma.service';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

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

  async createUser(userData: CreateUserDto) {
    const hash = await argon.hash(userData.password);
    try {
      const user = await this.db.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          nationalId: userData.nationalId,
          password: hash,
        },
      });

      return user;
    } catch (err) {
      // handle inserting existing national id or email
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === prismaErrors.INSERT_UNIQUE
      )
        throw new BadRequestException(
          error_msgs.ACCOUNT_ALREADY_EXISTS(err.meta?.target[0]),
        );

      throw new InternalServerErrorException('some thing went wrong');
    }
  }

  //   FIXME: dev only
  async getAll(take?: number, skip?: number) {
    const users = await this.db.user.findMany({
      select: {
        id: true,
        nationalId: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      take,
      skip,
    });
    return users;
  }
}
