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
  const port = configService.get('port') || 3000;
  const appDomain = configService.get('app.domain') || '*';

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

  // Enable CORS with broader configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Frontend development
      appDomain, // Production frontend
      'https://url-shortener-frontend-qfg9uawoi-milos-projects-0ac03486.vercel.app', // Specific frontend URL
      /\.vercel\.app$/, // Allow all vercel.app subdomains
      /\.onrender\.com$/, // Allow all Render domains
      '*', // Allow all origins as fallback
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition'],
    maxAge: 86400, // 24 hours in seconds
  });

  // Start server
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export for serverless use
export default bootstrap();
