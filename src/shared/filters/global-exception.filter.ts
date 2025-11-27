import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ThLogger, ThLoggerService } from 'themis';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: ThLogger;

  constructor(private readonly loggerService: ThLoggerService) {
    this.logger = this.loggerService.getLogger(GlobalExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      this.handleHttpException(exception, response, request);
      return;
    }

    this.handleGenericError(exception, response, request);
  }

  private handleHttpException(exception: HttpException, response: Response, request: Request): void {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as { message?: string }).message || 'Internal server error';

    response.status(status).json({
      statusCode: status,
      code: 'HTTP_EXCEPTION',
      message,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }

  private handleGenericError(exception: unknown, response: Response, request: Request): void {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof Error ? exception.message : 'Internal server error';

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(status).json({
      statusCode: status,
      code: 'INTERNAL_SERVER_ERROR',
      message,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
