import { createUserSchema } from './validation-schemas';
import { UsersService } from 'src/users/users.service';
import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { getCurrentUser, Public, UseValidation } from 'src/common/decorators';
import { USERS_BASE_URL } from 'src/constants';
import { CacheService } from 'src/redis/cache.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadValidationPipe } from './pipes';
import { User } from 'src/graphql';

@Controller(USERS_BASE_URL)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private cacheService: CacheService,
  ) {}

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
  async getUserProfile(@getCurrentUser('id') userId: string) {
    return await this.usersService.loggedInUserProfile(userId);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('profile')
  async uploadImage(
    @UploadedFile(FileUploadValidationPipe) file: Express.Multer.File,
    @Body('userId') userId,
  ) {
    return await this.usersService.uploadUserProfileImage(userId, file);
  }
  @Post('qr-generate')
  @HttpCode(HttpStatus.OK)
  async generateQrCode(@getCurrentUser() user: User) {
    return await this.usersService.generateHashedQrCode(user);
  }
}
