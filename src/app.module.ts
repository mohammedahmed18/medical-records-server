import { DoctorsModule } from './doctors/doctors.module';
import { GraphQlUtils } from './utils/graphqlUtils';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AtGuard } from './common/guards';
import { MedicalRecordsModule } from './medicalRecords/medicalRecords.module';
import { AdminModule } from './admin/admin.module';
import { RedisConfigModule } from './redis/redis.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    DatabaseModule,
    RedisConfigModule,
    AuthModule,
    UsersModule,
    DoctorsModule,
    MedicalRecordsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: process.env.NODE_ENV === 'development',
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true,
      persistedQueries: false
    }),
    ChatModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    GraphQlUtils.registerEnumTypes();
  }
}
