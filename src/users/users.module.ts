import { PrismaService } from './../prisma.service';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService , PrismaService],
  exports : [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
