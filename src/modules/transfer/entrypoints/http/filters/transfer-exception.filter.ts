import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ThLogger, ThLoggerService } from 'themis';

import { CreateTransferRequestDto } from '~/modules/transfer/entrypoints/http/dto/create-transfer-request.dto';
import {
  CreateTransferResponseDto,
  TransactionDataDto,
  TransactionResponseDto
} from '~/modules/transfer/entrypoints/http/dto';
import { DomainError, ApplicationError, InfrastructureError } from '~/shared/errors';

@Catch()
export class TransferExceptionFilter implements ExceptionFilter {
  private readonly logger: ThLogger;

  constructor(private readonly loggerService: ThLoggerService) {
    this.logger = this.loggerService.getLogger(TransferExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestBody = request.body as CreateTransferRequestDto | undefined;

    if (this.isValidationError(exception)) {
      this.handleValidationError(exception as HttpException | DomainError, response, request, requestBody);
      return;
    }

    this.handleTransferError(exception, response, request, requestBody);
  }

  private isValidationError(exception: unknown): boolean {
    if (exception instanceof BadRequestException || exception instanceof DomainError) {
      return true;
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return Number(status) === Number(HttpStatus.BAD_REQUEST);
    }
    return false;
  }

  private extractValidationMessage(exception: HttpException | DomainError): string {
    if (exception instanceof DomainError) {
      return exception.message;
    }

    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as { message?: string | string[] };
      if (Array.isArray(responseObj.message)) {
        return responseObj.message.join(', ');
      }
      if (typeof responseObj.message === 'string') {
        return responseObj.message;
      }
    }

    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    return 'Validation failed';
  }

  private handleValidationError(
    exception: HttpException | DomainError,
    response: Response,
    request: Request,
    requestBody?: CreateTransferRequestDto
  ): void {
    const status = HttpStatus.BAD_REQUEST;
    const message = this.extractValidationMessage(exception);

    if (!requestBody) {
      const errorResponse = this.buildSimplifiedErrorResponse('VALIDATION_FAILED', message);
      this.logger.warn(`${request.method} ${request.url} - ${status} - ${message}`);
      response.status(status).json(errorResponse);
      return;
    }

    const errorResponse = this.buildTransferValidationErrorResponse(requestBody, message);
    this.logger.warn(`${request.method} ${request.url} - ${status} - ${message}`);
    response.status(status).json(errorResponse);
  }

  private handleTransferError(
    exception: unknown,
    response: Response,
    request: Request,
    requestBody?: CreateTransferRequestDto
  ): void {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const { message, code } = this.extractErrorMessage(exception);

    if (!requestBody) {
      const errorResponse = this.buildSimplifiedErrorResponse(code, message);
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception instanceof Error ? exception.stack : undefined
      );
      response.status(status).json(errorResponse);
      return;
    }

    const errorResponse = this.buildTransferErrorResponse(requestBody, message, code);
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(status).json(errorResponse);
  }

  private buildSimplifiedErrorResponse(responseCode: string, message: string): CreateTransferResponseDto {
    return {
      responseCode,
      message
    };
  }

  private buildTransferValidationErrorResponse(
    requestBody: CreateTransferRequestDto,
    message: string
  ): CreateTransferResponseDto {
    return this.buildTransferErrorResponse(requestBody, message, 'VALIDATION_FAILED');
  }

  private buildTransferErrorResponse(
    requestBody: CreateTransferRequestDto,
    message: string,
    responseCode: string
  ): CreateTransferResponseDto {
    const transaction = this.buildErrorTransactionDto(requestBody);

    const data: TransactionDataDto = {
      transaction
    };

    return {
      responseCode,
      message,
      data
    };
  }

  private buildErrorTransactionDto(request: CreateTransferRequestDto): TransactionResponseDto {
    return {
      transactionId: request.transaction.transactionId
    };
  }

  private extractErrorMessage(exception: unknown): { message: string; code: string } {
    if (
      exception instanceof DomainError ||
      exception instanceof ApplicationError ||
      exception instanceof InfrastructureError
    ) {
      return {
        message: exception.message,
        code: exception.code
      };
    }

    if (exception instanceof Error) {
      return {
        message: exception.message || 'Internal error',
        code: 'ERROR'
      };
    }

    return {
      message: 'Internal error',
      code: 'ERROR'
    };
  }
}
