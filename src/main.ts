import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { MongoDBExceptionFilter } from './mongo-dbexception-filter/mongo-dbexception-filter.filter';
import { NetworkLoggerMiddleware } from './network-logger/network-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MongoDBExceptionFilter());
  app.use(new NetworkLoggerMiddleware().use);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();