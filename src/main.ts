import { CLIENT_URL } from './constants/common';
import { NotFoundExceptionFilter } from './common/Exceptions/NotFoundException';
import { ErrorInterceptor } from './common/interceptors';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalInterceptors(new ErrorInterceptor());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors({
    origin: CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    Logger.log(`application is running on port ${port}`);
  });
}
bootstrap();
