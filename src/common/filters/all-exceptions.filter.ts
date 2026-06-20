import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor() { }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Fallback to request.id if available (could be set by a middleware)
    const reqId = (request as any).id || 'N/A';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Log the error with the traceId
    if (status >= 500) {
      this.logger.error(
        {
          reqId,
          path: request.url,
          error: exception,
        },
        exception instanceof Error ? exception.stack : 'Unknown stack',
      );
    }
    else if (status === 429) {
      this.logger.warn({
        reqId,
        path: request.url,
        error: message,
      });
    }
    else {
      this.logger.log({
        reqId,
        path: request.url,
        error: message,
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // We pass the traceId to the client so they can report it to support
      traceId: reqId,
      message:
        status >= 500
          ? 'An unexpected error occurred. Please contact support with your traceId.'
          : message,
    });
  }
}
