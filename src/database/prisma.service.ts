import { PrismaClient } from '@prisma/client';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
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
    await this.seed()
    Logger.log('Database is connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    Logger.warn('Database is disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    // teardown logic
    return Promise.all([this.user.deleteMany()]).then(() => {
      Logger.warn('All users all deleted');
    });
  }


  async seed(){
    Logger.debug("removing all data inside Marital Status...")
    await this.marital_Status.deleteMany()
    Logger.debug("add seed for Marital Status...")

    await this.marital_Status.createMany({
      data : [
        {
          label : "single"
        },
        {
          label : "married"
        },
        {
          label : "divorced"
        }

      ]
    })

    Logger.debug("removing all data inside educational Level...")
    await this.educational_Level.deleteMany()

    Logger.debug("add seed for educational Level...")


    await this.educational_Level.createMany({
      data : [
        {
          label : "Diplome"
        }
      ]
    })



    Logger.debug("removing all data inside employment status...")
    await this.employment_Status.deleteMany()

    Logger.debug("add seed for employment status...")


    await this.employment_Status.createMany({
      data : [
        {
          label : "worker"
        },
        {
          label : "employee"
        },
        {
          label : "self-employed"
        }
      ]
    })


  }
}
