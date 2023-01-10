import { PrismaClient } from '@prisma/client';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const url = config.get<string>('DATABASE_URL');

    super({
      datasources: {
        db: {
          url,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    await this.cleanDatabase()
    Logger.log("Database is connected")
  }

  async onModuleDestroy() {
    await this.$disconnect();
    Logger.warn("Database is disconnected")

  }

  async cleanDatabase() {
    // if (process.env.NODE_ENV === 'production') return;

    // teardown logic
    return Promise.all([this.user.deleteMany()]).then(() => {
      Logger.warn("All users all deleted")
     });

  }
}
