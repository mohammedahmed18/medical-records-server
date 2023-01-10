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
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from 'src/common/types';
import { RtGuard , AtGuard } from './../common/guards';
import { getCurrentUser } from 'src/common/decorators';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: UserLoginDto) {
    return this.authService.login(body)
  }

  @Post("refresh")
  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@getCurrentUser() user : JwtPayload){
    return this.authService.refresh(user.id,user.refreshToken);
  }


  @Post("logout")
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@getCurrentUser("id") id : string){
    return this.authService.logout(id);
  }

}
