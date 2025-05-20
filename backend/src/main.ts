import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create NestJS application
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  // Get config service for environment variables
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  // Set up logging
  app.useLogger(app.get(Logger));

  // Set up global middleware
  app.use(helmet());

  // Set up global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Frontend development
      configService.get('app.domain'), // Production frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Start server
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

bootstrap();
