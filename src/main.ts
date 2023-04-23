import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { configService } from './config/config.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = configService.getPort();
  const corsOptions = configService.getCorsOptions();

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors(corsOptions);

  await app.listen(port);
}

bootstrap();
