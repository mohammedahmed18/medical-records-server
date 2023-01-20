import { createUserSchema } from './validation-schemas';
import { JoiValidationPipe } from 'src/common/pipes';
import { UsersService } from 'src/users/users.service';
import { Controller, Post, Body, UsePipes, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/common/decorators';
import { PublicUsers as PublicUser, User } from 'src/common/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //   FIXME: note this is only for testing remove it when the project is done
  @Post()
  @Public()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async createUser(@Body() data: CreateUserDto) : Promise<PublicUser> {
    return await this.usersService.createUser(data);
  }

  //   FIXME: note this is only for testing remove it when the project is done
  @Get()
  @Public()
  async getUsers(@Body() body) {
    return await this.usersService.getAll(body.take, body.skip);
  }
}
