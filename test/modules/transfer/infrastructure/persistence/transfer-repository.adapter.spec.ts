import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ThLogger, ThLoggerService } from 'themis';

import { MongoTransferRepository } from '~/modules/transfer/infrastructure/persistence/transfer-repository.adapter';
import { TransferDocument } from '~/modules/transfer/infrastructure/persistence/schemas/transfer.schema';

import { TransferFactory } from '../../../../factories/domain/entities/transfer.factory';
import { TransactionPartiesFactory } from '../../../../factories/domain/value-objects/transaction-parties.factory';

describe('MongoTransferRepository', () => {
  let repository: MongoTransferRepository;
  let mockModel: jest.Mock;
  let mockLogger: ThLogger;
  let mockDocument: jest.Mocked<TransferDocument>;

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

    mockDocument = {
      save: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<TransferDocument>;

    // Mock Model as a constructor function
    mockModel = jest.fn().mockImplementation(() => mockDocument);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoTransferRepository,
        {
          provide: getModelToken(TransferDocument.name),
          useValue: mockModel
        },
        { provide: ThLoggerService, useValue: mockLoggerService }
      ]
    }).compile();

    repository = module.get<MongoTransferRepository>(MongoTransferRepository);
  });

  describe('save', () => {
    it('should save transfer to MongoDB successfully', async () => {
      // Arrange
      const transfer = TransferFactory.create();

      // Act
      await repository.save(transfer);

      // Assert
      expect(mockModel).toHaveBeenCalledWith(expect.any(Object));
      expect(mockDocument.save).toHaveBeenCalledTimes(1);
      expect(mockLogger.log).toHaveBeenCalledWith(
        expect.stringContaining(`Persisting transfer ${transfer.transactionId} in MongoDB`)
      );
    });

    it('should map transfer context correctly to document', async () => {
      // Arrange
      const transfer = TransferFactory.create();

      // Act
      await repository.save(transfer);

      // Assert
      expect(mockModel).toHaveBeenCalled();
      const documentCall = mockModel.mock.calls[0];
      const documentData = documentCall[0];

      expect(documentData.context).toStrictEqual({
        pointOfSale: transfer.context.pointOfSale,
        terminal: transfer.context.terminal,
        productCode: transfer.context.productCode,
        trace: transfer.context.trace
      });
    });

    it('should map transfer amount correctly to document', async () => {
      // Arrange
      const transfer = TransferFactory.create();

      // Act
      await repository.save(transfer);

      // Assert
      expect(mockModel).toHaveBeenCalled();
      const documentCall = mockModel.mock.calls[0];
      const documentData = documentCall[0];

      expect(documentData.amount).toStrictEqual({
        value: transfer.amount.value,
        currency: transfer.amount.currency
      });
    });

    it('should map transaction parties correctly to document', async () => {
      // Arrange
      const transfer = TransferFactory.create();

      // Act
      await repository.save(transfer);

      // Assert
      expect(mockModel).toHaveBeenCalled();
      const documentCall = mockModel.mock.calls[0];
      const documentData = documentCall[0];

      expect(documentData.transactionParties).toBeDefined();
      expect(documentData.transactionParties.payee).toBeDefined();
      expect(documentData.transactionParties.payee.customerId).toBe(transfer.transactionParties.payee.customerId);
      expect(documentData.transactionParties.payee.accountInfo).toBeDefined();
      expect(documentData.transactionParties.payee.accountInfo.value).toBe(
        transfer.transactionParties.payee.accountInfo!.value
      );
    });

    it('should map payer correctly when present', async () => {
      // Arrange
      const transfer = TransferFactory.create();

      // Act
      await repository.save(transfer);

      // Assert
      expect(mockModel).toHaveBeenCalled();
      const documentCall = mockModel.mock.calls[0];
      const documentData = documentCall[0];

      if (transfer.transactionParties.payer) {
        expect(documentData.transactionParties.payer).toBeDefined();
        expect(documentData.transactionParties.payer.customerId).toBe(transfer.transactionParties.payer.customerId);
      }
    });

    it('should map payer as undefined when not present', async () => {
      // Arrange
      const transfer = TransferFactory.create({
        transactionParties: TransactionPartiesFactory.createWithoutPayer('CUST-002')
      });

      // Act
      await repository.save(transfer);

      // Assert
      expect(mockModel).toHaveBeenCalled();
      const documentCall = mockModel.mock.calls[0];
      const documentData = documentCall[0];

      expect(documentData.transactionParties.payer).toBeUndefined();
    });

    it('should map additionalData correctly when present', async () => {
      // Arrange
      const additionalData = {
        RESPONSE_CODE: 'SUCCESS',
        RESPONSE_MESSAGE: 'Transaction completed'
      };
      const transfer = TransferFactory.create({ additionalData });

      // Act
      await repository.save(transfer);

      // Assert
      expect(mockModel).toHaveBeenCalled();
      const documentCall = mockModel.mock.calls[0];
      const documentData = documentCall[0];

      expect(documentData.additionalData).toStrictEqual(additionalData);
    });

    it('should map externalTransactionId correctly when present', async () => {
      // Arrange
      const externalTransactionId = 'EXT-12345';
      const transfer = TransferFactory.create({ externalTransactionId });

      // Act
      await repository.save(transfer);

      // Assert
      expect(mockModel).toHaveBeenCalled();
      const documentCall = mockModel.mock.calls[0];
      const documentData = documentCall[0];

      expect(documentData.externalTransactionId).toBe(externalTransactionId);
    });

    it('should map externalTransactionId as undefined when empty string', async () => {
      // Arrange
      const transfer = TransferFactory.create({ externalTransactionId: '' });

      // Act
      await repository.save(transfer);

      // Assert
      expect(mockModel).toHaveBeenCalled();
      const documentCall = mockModel.mock.calls[0];
      const documentData = documentCall[0];

      expect(documentData.externalTransactionId).toBeUndefined();
    });

    it('should map payer accountInfo when present', async () => {
      // Arrange
      const transfer = TransferFactory.create();

      // Act
      await repository.save(transfer);

      // Assert
      expect(mockModel).toHaveBeenCalled();
      const documentCall = mockModel.mock.calls[0];
      const documentData = documentCall[0];

      if (transfer.transactionParties.payer?.accountInfo) {
        expect(documentData.transactionParties.payer.accountInfo).toStrictEqual({
          value: transfer.transactionParties.payer.accountInfo.value
        });
      }
    });

    it('should handle save error and propagate it', async () => {
      // Arrange
      const transfer = TransferFactory.create();
      const saveError = new Error('Database error');
      mockDocument.save = jest.fn().mockRejectedValue(saveError);

      // Act & Assert
      await expect(repository.save(transfer)).rejects.toThrow('Database error');
      expect(mockDocument.save).toHaveBeenCalledTimes(1);
    });
  });
});
