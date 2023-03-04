import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { DatabaseModule } from 'src/database/database.module';
import { AdminAuthResolver } from './admin-auth.resolver';
import { AdminAuthService } from './admin-auth.service';

@Module({
  imports: [JwtModule.register({}), DatabaseModule],
  providers: [AdminAuthService, AdminAuthResolver, AdminService],
})
export class AdminAuthModule {}
