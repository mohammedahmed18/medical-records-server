import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard, PermissionGuard } from 'src/common/guards';
import { DatabaseModule } from 'src/database/database.module';
import { AdminAuthModule } from './modules/auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule, DatabaseModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  controllers: [],
})
export class AdminModule {}
