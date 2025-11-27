import { Test, TestingModule } from '@nestjs/testing';
import { ThLogger, ThLoggerService } from 'themis';

import { TransferController } from '~/modules/transfer/entrypoints/http/controllers/transfer.controller';
import { ICreateTransferUseCase } from '~/modules/transfer/application/ports';
import { TOKENS } from '~/shared/constants/tokens.constant';
import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { TransferStatus } from '~/modules/transfer/domain/constants/transfer-status.enum';

import { TransferFactory, CreateTransferRequestFactory } from '../../../../../factories';

const mockCreateTransferUseCase: ICreateTransferUseCase = {
  execute: jest.fn()
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

describe('TransferController', () => {
  let controller: TransferController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        { provide: TOKENS.CREATE_TRANSFER_USE_CASE, useValue: mockCreateTransferUseCase },
        { provide: ThLoggerService, useValue: mockLoggerService }
      ]
    }).compile();

    controller = module.get<TransferController>(TransferController);
  });

  describe('createTransfer', () => {
    it('should call use case and return mapped response', async () => {
      // Arrange
      const dto = CreateTransferRequestFactory.create({
        transaction: {
          transactionId: 'tx-123',
          description: 'Test deposit',
          amount: {
            value: 1000,
            currency: 'COP'
          }
        }
      });

      const mockExecutedTransfer = TransferFactory.create({
        transactionId: 'tx-123',
        description: 'Test deposit',
        additionalData: {
          RESPONSE_CODE: TransferStatus.PENDING,
          RESPONSE_MESSAGE: 'Transfer pending for provider'
        }
      });

      (mockCreateTransferUseCase.execute as jest.Mock).mockResolvedValue({
        transfer: mockExecutedTransfer
      });

      // Act
      const result = await controller.createTransfer(dto);

      // Assert
      expect(mockCreateTransferUseCase.execute).toHaveBeenCalledWith(expect.any(Transfer));
      const calledTransfer = (mockCreateTransferUseCase.execute as jest.Mock).mock.calls[0][0] as Transfer;
      expect(calledTransfer.transactionId).toBe('tx-123');
      expect(calledTransfer.description).toBe('Test deposit');
      expect(result.responseCode).toBe(TransferStatus.PENDING);
      expect(result.message).toBe('Transfer pending for provider');
      expect(result.data).toBeDefined();
    });

    it('should handle errors from use case', async () => {
      // Arrange
      const dto = CreateTransferRequestFactory.create();
      const error = new Error('Use case failed');

      (mockCreateTransferUseCase.execute as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(controller.createTransfer(dto)).rejects.toThrow('Use case failed');
      expect(mockCreateTransferUseCase.execute).toHaveBeenCalledWith(expect.any(Transfer));
    });
  });
});
