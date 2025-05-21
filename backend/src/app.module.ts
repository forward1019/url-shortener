import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './common/database/database.module';
import { AllExceptionsFilter } from './common/exceptions/http-exception.filter';
import { ErrorLoggerMiddleware } from './common/middleware/error-logger.middleware';
import { HealthModule } from './common/health/health.module';
import { LinksModule } from './modules/links/links.module';
import { AuthModule } from './modules/auth/auth.module';
import configuration from './common/config/configuration';
import { validate } from './common/config/env.validation';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),

    // Logging
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        autoLogging: true,
      },
    }),

    // Database
    DatabaseModule,

    // Health checks
    HealthModule,

    // Feature modules
    AuthModule,
    LinksModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ErrorLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
