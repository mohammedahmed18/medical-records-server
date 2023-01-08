import { UsersService } from 'src/users/users.service';
import { error_msgs } from './../constants/errors';
import { UserLoginDto } from './dto/user-login.dto';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() body: UserLoginDto) {
    const _user = await this.authService.validate(body);
    if (!_user) throw new UnauthorizedException(error_msgs.UNAUTHORIZED_LOGIN);

    const token = await this.authService.generateJWT(_user);
    return { token };
  }
}
