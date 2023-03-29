import { CLIENT_URL, NETLIFY_URL } from './constants/common';
import { NotFoundExceptionFilter } from './common/Exceptions/NotFoundException';
import { ErrorInterceptor } from './common/interceptors';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import isProd from './utils/isProd';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const whiteList = [CLIENT_URL , NETLIFY_URL]
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalInterceptors(new ErrorInterceptor());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    helmet({
      frameguard: {
        action: 'deny',
      },
      contentSecurityPolicy : isProd ? undefined : false, // will enable the graphql playgrond only during development 
    }),
  );
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whiteList.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    Logger.log(`application is running on port ${port}`);
  });
}
bootstrap();
