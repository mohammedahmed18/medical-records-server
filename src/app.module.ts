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
import { GraphQLDateTime } from 'graphql-iso-date';
import { DoctorRequestModule } from './doctorRequests/DoctorRequest.module';
import { OpenAIModule } from './openai/openai.module';
import { CLIENT_URL } from './constants';

function getTokenFromCookie(cookie: string) {
  if(!cookie) return null
  const pairs = cookie.split(';');
  let token = null;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].trim().split('=');
    const key = pair[0];
    const value = pair[1];

    if (key === 'token') {
      token = value;
      break;
    }
  }

  return token;
}
@Module({
  imports: [
    DatabaseModule,
    RedisConfigModule,
    AuthModule,
    UsersModule,
    DoctorsModule,
    DoctorRequestModule,
    MedicalRecordsModule,
    OpenAIModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: process.env.NODE_ENV === 'development',
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true,
      persistedQueries: false,
      resolvers: { DateTime: GraphQLDateTime },
      installSubscriptionHandlers: true,
      context: (params) => {
        const subReq = params?.extra?.request;
        const req = subReq || params.req;

        const cookie = req.headers?.cookie;

        const accessToken = getTokenFromCookie(cookie)
        
        const headers = subReq
          ? {
              ...subReq.headers,
              authorization: accessToken ?
                'Bearer ' + accessToken : null,
            }
          : params.req.headers;


        return {
          ...params,
          req : {
            ...req , headers
          },
        };
      },
      cors: {
        origin: CLIENT_URL,
        credentials: true,
      },
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (headersRaw: Record<string, unknown>) => {
            // Lowercase each header key
            const headers = Object.keys(headersRaw).reduce((dest, key) => {
              dest[key.toLowerCase()] = headersRaw[key];
              return dest;
            }, {});
            return {
              req: {
                headers,
              },
            };
          },
        },
        'graphql-ws': {
          onConnect: (connectionParams: { [key: string]: any }) => {
            const req = connectionParams.extra.request;
            const headersRaw = req.headers;
            // Lowercase each header key
            const headers = Object.keys(headersRaw).reduce((dest, key) => {
              dest[key.toLowerCase()] = headersRaw[key];
              return dest;
            }, {});
            return {
              req: {
                ...req,
                headers,
              },
            };
          },
        },
      },
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
