import { PrismaService } from './../prisma.service';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RtStrategy, AtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [UsersModule, JwtModule.register({})],
  providers: [AuthService, AtStrategy, RtStrategy, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
