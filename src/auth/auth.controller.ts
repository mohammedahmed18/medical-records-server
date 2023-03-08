import { UserLoginDto } from './dto/user-login.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from 'src/common/types';
import { RtGuard, AtGuard } from './../common/guards';
import { getCurrentUser, UseValidation, Public } from 'src/common/decorators';
import { loginSchema } from './validation-schemas';
import { AUTH_BASE_URL, CLIENT_URL, TOKEN_LIFETIME } from 'src/constants';
import { Response as ExpressResponse } from 'express';
import isProd from 'src/utils/isProd';

@Controller(AUTH_BASE_URL)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @Public()
  @UseValidation(loginSchema)
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: UserLoginDto, @Response() res: ExpressResponse) {
    const tokens = await this.authService.login(body);
    res
      .cookie('token', tokens.accessToken, {
        httpOnly: true,
        sameSite: isProd ? 'none' : true,
        maxAge: TOKEN_LIFETIME,
        secure: isProd ? true : false,
        domain: CLIENT_URL,
      })
      .json(tokens)
      .end();
  }

  @Post('refresh')
  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@getCurrentUser() user: JwtPayload) {
    return this.authService.refresh(user.id, user.refreshToken);
  }

  @Post('logout')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@getCurrentUser({ field: 'id' }) id: string) {
    return this.authService.logout(id);
  }
}
