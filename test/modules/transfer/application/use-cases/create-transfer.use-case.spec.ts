import { Test, TestingModule } from '@nestjs/testing';
import { ThLogger, ThLoggerService } from 'themis';

import { CreateTransferUseCase } from '~/modules/transfer/application/use-cases/create-transfer.use-case';
import { IGatewayClient } from '~/modules/transfer/application/ports/providers/gateway-client.port';
import { TOKENS } from '~/shared/constants/tokens.constant';
import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { TransferGatewayResult } from '~/modules/transfer/domain/types/transfer-gateway-result.type';
import { AdditionalDataKey } from '~/modules/transfer/domain/constants/additional-data-key.enum';
import { TransferStatus } from '~/modules/transfer/domain/constants/transfer-status.enum';

import { TransferMother } from '../../../../mothers';

const mockCredClient: IGatewayClient = {
  createTransfer: jest.fn()
};

const mockTransferRepository = {
  save: jest.fn()
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

describe('CreateTransferUseCase', () => {
  let useCase: CreateTransferUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransferUseCase,
        { provide: TOKENS.GATEWAY_CLIENT, useValue: mockCredClient },
        { provide: TOKENS.TRANSFER_REPOSITORY, useValue: mockTransferRepository },
        { provide: ThLoggerService, useValue: mockLoggerService }
      ]
    }).compile();

    useCase = module.get<CreateTransferUseCase>(CreateTransferUseCase);
  });

  describe('execute method', () => {
    it('should apply gateway result and return transfer with responseCode and message in additionalData', async () => {
      // Arrange
      const transfer = TransferMother.valid();
      const gatewayResult: TransferGatewayResult = {
        transactionId: transfer.transactionId,
        externalTransactionId: 'EXT-001',
        responseCode: TransferStatus.SUCCESS,
        message: 'Transaction completed successfully'
      };

      (mockCredClient.createTransfer as jest.Mock).mockResolvedValue(gatewayResult);
      mockTransferRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(transfer);

      // Assert
      expect(mockCredClient.createTransfer).toHaveBeenCalledWith(transfer);
      expect(mockTransferRepository.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Transfer);
      expect(result.externalTransactionId).toBe('EXT-001');
      expect(result.additionalData?.[AdditionalDataKey.RESPONSE_CODE]).toBe('SUCCESS');
      expect(result.additionalData?.[AdditionalDataKey.RESPONSE_MESSAGE]).toBe('Transaction completed successfully');
    });

    it('should handle errors from gateway client', async () => {
      // Arrange
      const transfer = TransferMother.valid();
      const error = new Error('Provider connection failed');
      (mockCredClient.createTransfer as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute(transfer)).rejects.toThrow('Provider connection failed');
      expect(mockCredClient.createTransfer).toHaveBeenCalledWith(transfer);
      expect(mockTransferRepository.save).not.toHaveBeenCalled();
    });
  });
});
