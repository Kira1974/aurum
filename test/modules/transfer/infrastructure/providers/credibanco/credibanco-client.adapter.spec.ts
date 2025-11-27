import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { ThLogger, ThLoggerService } from 'themis';
import { of, throwError } from 'rxjs';

import { CredibancoClientAdapter } from '~/modules/transfer/infrastructure/providers/credibanco/credibanco-client.adapter';
import { ProviderUnavailableError } from '~/modules/transfer/infrastructure/providers/errors';
import { GatewayClientResponse } from '~/modules/transfer/infrastructure/providers/credibanco/mappings/gateway.type';
import { TransferStatus } from '~/modules/transfer/domain/constants/transfer-status.enum';

import { TransferFactory } from '../../../../../factories/domain/entities/transfer.factory';

const mockHttpService = {
  post: jest.fn()
};

const mockLogger: ThLogger = {
  warn: jest.fn(),
  log: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  info: jest.fn()
} as unknown as ThLogger;

const mockLoggerService: Partial<ThLoggerService> = {
  getLogger: jest.fn().mockReturnValue(mockLogger)
};

describe('CredibancoClientAdapter', () => {
  let adapter: CredibancoClientAdapter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredibancoClientAdapter,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ThLoggerService, useValue: mockLoggerService }
      ]
    }).compile();

    adapter = module.get<CredibancoClientAdapter>(CredibancoClientAdapter);
  });

  describe('createTransfer', () => {
    xit('should return TransferGatewayResult when request succeeds', async () => {
      // Arrange
      const transfer = TransferFactory.create();
      const mockResponse: AxiosResponse<GatewayClientResponse> = {
        data: {
          transactionId: 'TX-001',
          externalTransactionId: 'EXT-001',
          responseCode: TransferStatus.SUCCESS,
          message: 'Transaction completed',
          additionalData: {}
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      // Act
      const result = await adapter.createTransfer(transfer);

      // Assert
      expect(result).toStrictEqual({
        transactionId: 'TX-001',
        externalTransactionId: 'EXT-001',
        responseCode: 'SUCCESS',
        message: 'Transaction completed',
        additionalData: {}
      });
      expect(mockHttpService.post).toHaveBeenCalledWith('http://localhost:8080/api/cred', expect.any(Object), {
        timeout: 30000
      });
    });

    xit('should throw ProviderUnavailableError when HTTP request fails with status code', async () => {
      // Arrange
      const transfer = TransferFactory.create();
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        status: 500,
        data: { message: 'Internal server error' },
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any
      };

      mockHttpService.post.mockReturnValue(throwError(() => axiosError));

      // Act & Assert
      await expect(adapter.createTransfer(transfer)).rejects.toThrow(ProviderUnavailableError);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    xit('should throw ProviderUnavailableError when timeout occurs', async () => {
      // Arrange
      const transfer = TransferFactory.create();
      const axiosError = new AxiosError('timeout of 30000ms exceeded');
      axiosError.code = 'ECONNABORTED';

      mockHttpService.post.mockReturnValue(throwError(() => axiosError));

      // Act & Assert
      await expect(adapter.createTransfer(transfer)).rejects.toThrow(ProviderUnavailableError);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    xit('should throw ProviderUnavailableError when generic error occurs', async () => {
      // Arrange
      const transfer = TransferFactory.create();
      const error = new Error('Network error');

      mockHttpService.post.mockReturnValue(throwError(() => error));

      // Act & Assert
      await expect(adapter.createTransfer(transfer)).rejects.toThrow(ProviderUnavailableError);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    xit('should throw ProviderUnavailableError when unknown error type occurs', async () => {
      // Arrange
      const transfer = TransferFactory.create();

      mockHttpService.post.mockReturnValue(throwError(() => 'Unknown error'));

      // Act & Assert
      await expect(adapter.createTransfer(transfer)).rejects.toThrow(ProviderUnavailableError);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
