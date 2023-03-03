import { createUserSchema } from './validation-schemas';
import { UsersService } from 'src/users/users.service';
import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { getCurrentUser, Public, UseValidation } from 'src/common/decorators';
import { USERS_BASE_URL } from 'src/constants';

@Controller(USERS_BASE_URL)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //   FIXME: note this is only for testing remove it when the project is done
  @Post()
  @Public()
  @UseValidation(createUserSchema)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() data): Promise<string> {
    return await this.usersService.createUser(data);
  }

  //   FIXME: note this is only for testing remove it when the project is done
  @Get()
  @Public()
  async getUsers(@Body() body) {
    return await this.usersService.getAll(body.take, body.skip);
  }

  @Get('/me')
  async getUserProfile(@getCurrentUser({ field: 'id' }) userId: string) {
    return await this.usersService.loggedInUserProfile(userId);
  }
}
