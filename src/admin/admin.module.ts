import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard, PermissionGuard } from 'src/common/guards';

@Module({
  imports: [],
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
