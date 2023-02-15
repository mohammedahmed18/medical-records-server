import { ErrorInterceptor } from './common/interceptors';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ErrorInterceptor())
  app.enableCors()
  const port = process.env.PORT || 3000;

  await app.listen(port , () => {
    Logger.log(`application is running on port ${port}`)
  });
}
bootstrap();
