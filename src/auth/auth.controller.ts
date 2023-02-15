import { Public } from './../common/decorators/public.decorator';
import { UserLoginDto } from './dto/user-login.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from 'src/common/types';
import { RtGuard, AtGuard } from './../common/guards';
import { getCurrentUser } from 'src/common/decorators';
import { JoiValidationPipe } from 'src/common/pipes';
import { loginSchema } from './validation-schemas';
import { AUTH_BASE_URL, LOGIN_URL } from 'src/constants';

@Controller(AUTH_BASE_URL)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(LOGIN_URL)
  @Public()
  @UsePipes(new JoiValidationPipe(loginSchema))
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: UserLoginDto) {
    return this.authService.login(body);
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
  async logout(@getCurrentUser('id') id: string) {
    return this.authService.logout(id);
  }
}
