import { UsersService } from 'src/users/users.service';
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
 constructor(private readonly usersService: UsersService) {}

//   FIXME: note this is only for testing remove it when the project is done
  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() data:CreateUserDto){
    const user = await this.usersService.createUser(data)
    return user
  }
}
