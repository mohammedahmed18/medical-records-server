import { User } from './../common/types/index';
import { UserLoginDto } from './dto/user-login.dto';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { commons } from 'src/constants';
import * as argon2 from 'argon2';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
    constructor (private readonly userService : UsersService){}

    async validate(credentials: UserLoginDto) {
        const {nationalId , password} = credentials
        const user = await this.userService.findByNationalId(nationalId)
    
        const match = await argon2.verify(user.password , password) 
        if (user && match ) return user;
        
        return null;
      }


      generateJWT(user: User) {
        const { password, ...payload } = user; //seperate the password from the payload
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: commons.TOKEN_LIFETIME });
      }
    
}
