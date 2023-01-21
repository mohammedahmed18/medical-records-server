import { PrismaService } from '../database/prisma.service';
import { Injectable} from '@nestjs/common';
import * as argon from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { PublicUsers } from 'src/common/types';
import { PUBLIC_FIELDS } from 'src/constants';

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

  async createUser(userData: CreateUserDto) : Promise<PublicUsers> {
    const hash = await argon.hash(userData.password);
    const user = await this.db.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          nationalId: userData.nationalId,
          password: hash,
        },
        select : PUBLIC_FIELDS
      });

      return user;
  }

  //   FIXME: dev only
  async getAll(take?: number, skip?: number) : Promise<PublicUsers[]> {
    const users = await this.db.user.findMany({
      select: PUBLIC_FIELDS,
      take,
      skip,
    });
    return users;
  }
}
