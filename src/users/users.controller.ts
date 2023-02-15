import { createUserSchema } from './validation-schemas';
import { JoiValidationPipe } from 'src/common/pipes';
import { UsersService } from 'src/users/users.service';
import { Controller, Post, Body, UsePipes, Get } from '@nestjs/common';
import { getCurrentUser, Public } from 'src/common/decorators';
import {  PublicUser } from 'src/common/types';
import { USERS_BASE_URL, USER_PROFILE_URL } from 'src/constants';

@Controller(USERS_BASE_URL)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //   FIXME: note this is only for testing remove it when the project is done
  @Post()
  @Public()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async createUser(@Body() data) : Promise<PublicUser> {
    return await this.usersService.createUser(data);
  }

  //   FIXME: note this is only for testing remove it when the project is done
  @Get()
  @Public()
  async getUsers(@Body() body) {
    return await this.usersService.getAll(body.take, body.skip);
  }


  @Get(USER_PROFILE_URL)
  async getUserProfile(@getCurrentUser() currentUser){
      return await this.usersService.loggedInUserProfile(currentUser);
  }

}
