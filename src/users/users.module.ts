import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserResolver } from './users.resolver';
import { RedisConfigModule } from 'src/redis/redis.module';

@Module({
  imports: [DatabaseModule, RedisConfigModule],
  providers: [UsersService, UserResolver],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
