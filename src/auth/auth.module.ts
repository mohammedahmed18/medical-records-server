import { QrCodeStrategy } from './strategies/qr.strategy';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RtStrategy, AtStrategy, AdminAtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { RedisConfigModule } from 'src/redis/redis.module';
@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    JwtModule.register({}),
    RedisConfigModule,
  ],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    AdminAtStrategy,
    QrCodeStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
