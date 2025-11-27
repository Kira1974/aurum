import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ThLogger, ThLoggerService } from 'themis';

import { GlobalExceptionFilter } from '~/shared/filters/global-exception.filter';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
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
      providers: [GlobalExceptionFilter, { provide: ThLoggerService, useValue: mockLoggerService }]
    }).compile();

    filter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockRequest = {
      url: '/api/v1/health',
      method: 'GET'
    };

    mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse as Response,
        getRequest: () => mockRequest as Request
      })
    } as ArgumentsHost;
  });

  describe('HTTP exceptions', () => {
    it('should handle HttpException with generic format', () => {
      const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.NOT_FOUND,
          code: 'HTTP_EXCEPTION',
          message: 'Not Found',
          timestamp: expect.any(String),
          path: '/api/v1/health'
        })
      );
    });

    it('should handle HttpException with object response', () => {
      const exception = new HttpException(
        {
          message: 'Custom error message',
          error: 'Bad Request'
        },
        HttpStatus.BAD_REQUEST
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          code: 'HTTP_EXCEPTION',
          message: 'Custom error message'
        })
      );
    });

    it('should handle HttpException with string response', () => {
      const exception = new HttpException('Simple error message', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Simple error message'
        })
      );
    });
  });

  describe('Generic errors', () => {
    it('should handle generic Error with generic format', () => {
      const exception = new Error('Internal server error');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
          timestamp: expect.any(String),
          path: '/api/v1/health'
        })
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle unknown error type', () => {
      const exception = { customProperty: 'unknown error' } as unknown;

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error'
        })
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should log error stack trace', () => {
      const exception = new Error('Test error');
      const errorStack = 'Error stack trace';

      Object.defineProperty(exception, 'stack', {
        value: errorStack,
        writable: true
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('GET /api/v1/health'), errorStack);
    });
  });
});
