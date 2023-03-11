import { CLIENT_URL } from './../constants/common';
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
import { AUTH_BASE_URL, TOKEN_LIFETIME } from 'src/constants';
import { Response as ExpressResponse } from 'express';
import isProd from 'src/utils/isProd';

@Controller(AUTH_BASE_URL)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly TOKEN_COOKIE = 'token';
  @Post('/login')
  @Public()
  @UseValidation(loginSchema)
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: UserLoginDto, @Response() res: ExpressResponse) {
    const tokens = await this.authService.login(body);
    res.header('Access-Control-Allow-Origin', CLIENT_URL);
    res
      .cookie(this.TOKEN_COOKIE, tokens.accessToken, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        expires: new Date(Date.now() + TOKEN_LIFETIME * 1000),
        secure: isProd,
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
  async logout(
    @getCurrentUser({ field: 'id' }) id: string,
    @Response() res: ExpressResponse,
  ) {
    const success = await this.authService.logout(id);
    res
      .clearCookie(this.TOKEN_COOKIE, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
      })
      .send(success);
  }
}
