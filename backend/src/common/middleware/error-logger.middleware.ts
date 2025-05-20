import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('ErrorLogger');

  use(req: Request, res: Response, next: NextFunction) {
    // Store original response methods to intercept
    const originalSend = res.send;
    const originalJson = res.json;
    const originalEnd = res.end;

    // Log the incoming request
    this.logger.log(`Incoming request: ${req.method} ${req.url}`);
    
    // Override response send method to log error responses
    res.send = (...args: any[]): Response => {
      if (res.statusCode >= 400) {
        this.logger.error(`Error ${res.statusCode} for ${req.method} ${req.url}`);
        this.logger.error(`Response body: ${JSON.stringify(args[0])}`);
      }
      return originalSend.apply(res, args);
    };
    
    // Override response json method to log error responses
    res.json = (...args: any[]): Response => {
      if (res.statusCode >= 400) {
        this.logger.error(`Error ${res.statusCode} for ${req.method} ${req.url}`);
        this.logger.error(`Response body: ${JSON.stringify(args[0])}`);
      }
      return originalJson.apply(res, args);
    };

    // Override response end method
    res.end = (...args: any[]): Response => {
      if (res.statusCode >= 400) {
        this.logger.error(`Error ${res.statusCode} for ${req.method} ${req.url}`);
      }
      return originalEnd.apply(res, args);
    };

    // Handle exceptions
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error('Unhandled Rejection:', reason);
    });

    next();
  }
} 