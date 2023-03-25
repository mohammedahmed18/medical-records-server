import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserResolver } from './users.resolver';
import { RedisConfigModule } from 'src/redis/redis.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    RedisConfigModule,
    CloudinaryModule,
    MulterModule.register({
      storage: memoryStorage(), // use memory storage for having the buffer
    }),
    JwtModule.register({}),
  ],
  providers: [UsersService, UserResolver],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
