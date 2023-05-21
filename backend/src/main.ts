import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { EventEmitter } from 'events';
import { AppModule } from './app.module';

EventEmitter.setMaxListeners(0);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // app.useGlobalFilters(new AllExceptionsSocketFilter()); // TOOD: Global Filter doesn't work.

  await app.listen(3000);
}

bootstrap();
