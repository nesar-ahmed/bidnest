import 'reflect-metadata';
import './config/env';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger';

export function configureApp(app: INestApplication): INestApplication {
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
    credentials: true, // cookies are cross-port in dev: 3000 -> 4000
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: false }));
  return app;
}

async function bootstrap(): Promise<void> {
  const app = configureApp(await NestFactory.create(AppModule));
  setupSwagger(app);

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`[api] listening on http://localhost:${port}/api/v1`);
  console.log(`[api] OpenAPI docs on http://localhost:${port}/api/docs`);
}

// Tests import configureApp; only start a server when this file is the entrypoint.
if (typeof require !== 'undefined' && require.main === module) {
  void bootstrap();
}
