import { error_msgs } from './../constants/errors';
import { PrismaService } from './../prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon from 'argon2'
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}

  async findByNationalId(nationalId : string) {
    const user = await this.db.user.findFirst({
      where: { nationalId },
    });
    if (user) {
      return user;
    }
    return null;
  }


  async createUser(userData : CreateUserDto){
    const hash = await argon.hash(userData.password)
    const _user = await this.findByNationalId(userData.nationalId)    
    if(_user) throw new BadRequestException(error_msgs.ACCOUNT_ALREADY_EXISTS)
    const user = await this.db.user.create({
        data : {
            name : userData.name,
            email : userData.email,
            nationalId : userData.nationalId,
            password : hash
        }
    })

    return user
  }

}


