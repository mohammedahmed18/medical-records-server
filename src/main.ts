import { ErrorInterceptor } from './common/interceptors';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ErrorInterceptor())
  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();
