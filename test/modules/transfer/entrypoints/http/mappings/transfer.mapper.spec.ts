import { TransferMapper } from '~/modules/transfer/entrypoints/http/mappings/transfer.mapper';
import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { NotificationChannel } from '~/modules/transfer/domain/constants/notification-channel.enum';
import { TransferStatus } from '~/modules/transfer/domain/constants/transfer-status.enum';

import { TransferFactory, CreateTransferRequestFactory, NotificationFactory } from '../../../../../factories';

describe('TransferMapper', () => {
  describe('toEntity', () => {
    it('should map CreateTransferRequestDto to Transfer correctly', () => {
      // Arrange
      const dto = CreateTransferRequestFactory.create();

      // Act
      const result = TransferMapper.toEntity(dto);

      // Assert
      expect(result).toBeInstanceOf(Transfer);
      expect(result.transactionId).toBe('TX-001');
      expect(result.amount.value).toBe(1000);
      expect(result.amount.currency).toBe('COP');
      expect(result.description).toBe('Test transfer');
      expect(result.transactionParties.payer?.customerId).toBe('CUST-001');
      expect(result.transactionParties.payee.customerId).toBe('CUST-002');
      expect(result.transactionParties.payee.cellphone).toBe('3001234567');
    });

    it('should map DTO without additionalData to Transfer with undefined additionalData', () => {
      // Arrange
      const dto = CreateTransferRequestFactory.create();

      // Act
      const result = TransferMapper.toEntity(dto);

      // Assert
      expect(result.additionalData).toBeUndefined();
    });
  });

  describe('toCreateTransferResponseDto', () => {
    it('should map Transfer to CreateTransferResponseDto correctly', () => {
      // Arrange
      const transfer = TransferFactory.create({
        additionalData: {
          RESPONSE_CODE: TransferStatus.SUCCESS,
          RESPONSE_MESSAGE: 'Transaction completed'
        }
      });

      // Act
      const result = TransferMapper.toCreateTransferResponseDto(transfer);

      // Assert
      expect(result.responseCode).toBe(TransferStatus.SUCCESS);
      expect(result.message).toBe('Transaction completed');
      expect(result.data).toBeDefined();
    });

    it('should return empty strings for responseCode and message when not in additionalData', () => {
      // Arrange
      const transfer = TransferFactory.create();

      // Act
      const result = TransferMapper.toCreateTransferResponseDto(transfer);

      // Assert
      // El gateway siempre devuelve estos valores, pero antes de aplicar el resultado del gateway serán undefined
      expect(result.responseCode).toBe('');
      expect(result.message).toBe('');
      expect(result.data).toBeDefined();
    });

    it('should map notification correctly when notification exists', () => {
      // Arrange
      const notification = NotificationFactory.create(
        NotificationChannel.SMS,
        '3001234567',
        'Tu pago de $1000 COP esta pendiente de confirmacion.'
      );
      const transfer = TransferFactory.create();

      // Act
      const result = TransferMapper.toCreateTransferResponseDto(transfer, notification);

      // Assert
      expect(result.data).toBeDefined();
      expect(result.data!.notification).toBeDefined();
      expect(Array.isArray(result.data!.notification)).toBe(true);
      expect(result.data!.notification!).toHaveLength(1);
      expect(result.data!.notification![0].channel).toBe('SMS');
      expect(result.data!.notification![0].value).toBe('3001234567');
      expect(result.data!.notification![0].message).toBe('Tu pago de $1000 COP esta pendiente de confirmacion.');
    });

    it('should not include notification when notification is undefined', () => {
      // Arrange
      const transfer = TransferFactory.create();

      // Act
      const result = TransferMapper.toCreateTransferResponseDto(transfer);

      // Assert
      expect(result.data).toBeDefined();
      expect(result.data!.notification).toBeUndefined();
    });
  });
});
