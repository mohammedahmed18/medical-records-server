import { PrismaService } from '../database/prisma.service';
import { error_msgs } from './../constants/errors';
import {User} from '@prisma/client'
import { UserLoginDto } from './dto/user-login.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { TOKEN_LIFETIME , RT_TOKEN_LIFETIME } from 'src/constants';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private config: ConfigService,
    private jwt: JwtService,
    private db: PrismaService,
  ) {}

  // controllers handlers

  async login(credentials: UserLoginDto) {
    const _user = await this.validate(credentials);

    if (!_user) throw new ForbiddenException(error_msgs.UNAUTHORIZED_LOGIN);

    const tokens = await this.generateJWT(_user);
    await this.userService.updateRtHash(_user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(userId: string, refreshToken: string) {
    const _user = await this.db.user.findFirst({ where: { id: userId } });

    if (!_user || !_user.hashedRt)
      throw new ForbiddenException('Access Denied');

    const matches = await argon2.verify(_user.hashedRt, refreshToken);

    if (!matches) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateJWT(_user);
    await this.userService.updateRtHash(_user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    await this.db.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return true;
  }

  // utilities
  async validate(credentials: UserLoginDto) {
    const { nationalId, password } = credentials;
    const user = await this.userService.findByNationalId(nationalId);

    if (user && (await argon2.verify(user.password, password))) return user;

    return null;
  }

  async generateJWT(user: User) {
    const { password,hashedRt, ...payload } = user; //seperate the password from the payload

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: TOKEN_LIFETIME,
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('RT_SECRET'),
        expiresIn: RT_TOKEN_LIFETIME,
      }),
    ]);

    return { accessToken: at, refreshToken: rt };
  }
}
