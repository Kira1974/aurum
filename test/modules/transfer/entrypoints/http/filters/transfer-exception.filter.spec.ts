import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ThLogger, ThLoggerService } from 'themis';

import { TransferExceptionFilter } from '~/modules/transfer/entrypoints/http/filters/transfer-exception.filter';
import { ApplicationError } from '~/shared/errors/application-error.base';
import { InfrastructureError } from '~/shared/errors/infrastructure-error.base';
import { InvalidAmountError } from '~/modules/transfer/domain/errors';
import { CreateTransferRequestDto } from '~/modules/transfer/entrypoints/http/dto/create-transfer-request.dto';

class TestApplicationError extends ApplicationError {
  readonly code = 'TEST_APP_ERROR';
  constructor(message: string) {
    super(message);
  }
}

class TestInfrastructureError extends InfrastructureError {
  readonly code = 'TEST_INFRA_ERROR';
  constructor(message: string) {
    super(message);
  }
}

describe('TransferExceptionFilter', () => {
  let filter: TransferExceptionFilter;
  let mockLogger: ThLogger;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockLogger = {
      warn: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      info: jest.fn()
    } as unknown as ThLogger;

    const mockLoggerService: Partial<ThLoggerService> = {
      getLogger: jest.fn().mockReturnValue(mockLogger)
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferExceptionFilter, { provide: ThLoggerService, useValue: mockLoggerService }]
    }).compile();

    filter = module.get<TransferExceptionFilter>(TransferExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockRequest = {
      url: '/api/v1/transfers',
      method: 'POST',
      body: {
        context: {
          pointOfSale: 'POS-123',
          terminal: 'TERM-001',
          productCode: 'C79',
          trace: '3108de04'
        },
        transaction: {
          transactionId: 'TX-001',
          amount: {
            value: 1000,
            currency: 'COP'
          },
          description: 'Test transfer'
        },
        transactionParties: {
          payer: {
            customerId: 'CUST-001',
            documentType: 'CC',
            documentNumber: '1234567890'
          },
          payee: {
            customerId: 'CUST-002',
            documentType: 'CC',
            documentNumber: '0987654321'
          }
        }
      } as CreateTransferRequestDto
    };

    mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse as Response,
        getRequest: () => mockRequest as Request
      })
    } as ArgumentsHost;
  });

  describe('Validation errors', () => {
    it('should handle BadRequestException with transfer format', () => {
      const exception = new BadRequestException('Validation failed: amount must be greater than 0');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          responseCode: 'VALIDATION_FAILED',
          message: 'Validation failed: amount must be greater than 0',
          data: expect.any(Object)
        })
      );
      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should handle DomainError with transfer format', () => {
      const exception = new InvalidAmountError(0);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          responseCode: 'VALIDATION_FAILED',
          message: expect.stringContaining('Amount must be greater than 0'),
          data: expect.any(Object)
        })
      );
      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should handle array of validation messages', () => {
      const exception = new BadRequestException(['Error 1', 'Error 2']);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error 1, Error 2'
        })
      );
    });
  });

  describe('Internal errors', () => {
    it('should handle ApplicationError with transfer format', () => {
      const exception = new TestApplicationError('Application error occurred');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          responseCode: 'TEST_APP_ERROR',
          message: 'Application error occurred',
          data: expect.any(Object)
        })
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle InfrastructureError with transfer format', () => {
      const exception = new TestInfrastructureError('Infrastructure error occurred');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          responseCode: 'TEST_INFRA_ERROR',
          message: 'Infrastructure error occurred',
          data: expect.any(Object)
        })
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle generic Error with transfer format', () => {
      const exception = new Error('Generic error occurred');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          responseCode: 'ERROR',
          message: 'Generic error occurred',
          data: expect.any(Object)
        })
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('Request without body', () => {
    beforeEach(() => {
      mockRequest.body = undefined;
    });

    it('should handle error with simplified transfer format when request body is undefined', () => {
      const exception = new Error('Generic error');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          responseCode: 'ERROR',
          message: 'Generic error'
        })
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          data: expect.anything()
        })
      );
    });

    it('should handle validation error with simplified transfer format when request body is undefined', () => {
      const exception = new BadRequestException('Validation failed');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          responseCode: 'VALIDATION_FAILED',
          message: 'Validation failed'
        })
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          data: expect.anything()
        })
      );
    });
  });
});
