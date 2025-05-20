import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  path?: string;
  timestamp?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    // Handle HttpExceptions (NestJS built-in exceptions)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || 'Error';
      } else {
        message = exception.message;
      }
    }
    // Handle Prisma errors
    else if (exception instanceof PrismaClientKnownRequestError) {
      // Handle unique constraint violations
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        const fields = exception.meta?.target;
        if (fields && Array.isArray(fields) && fields.includes('shortSlug')) {
          message = `The slug is already taken, please choose another one.`;
        } else if (fields && Array.isArray(fields)) {
          message = `Duplicate value for unique field: ${fields.join(', ')}`;
        } else {
          message = `A unique constraint violation occurred.`;
        }
        error = 'Conflict';
      }
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json(errorResponse);
  }
}
