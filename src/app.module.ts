import { GraphQlUtils } from './utils/graphqlUtils';
import { AtGuard } from './common/guards/at.guard';
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

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: process.env.NODE_ENV === "development",
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true
    }),
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
    GraphQlUtils.registerEnumTypes()
  }
}
