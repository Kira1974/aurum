import { Notification } from '~/modules/transfer/domain/value-objects/notification.vo';
import { NotificationChannel } from '~/modules/transfer/domain/constants/notification-channel.enum';
import { PROCESSOR_BREB } from '~/modules/transfer/domain/constants/notification.constants';

describe('Notification', () => {
  describe('constructor', () => {
    it('should create Notification with all properties', () => {
      // Arrange & Act
      const notification = new Notification(NotificationChannel.SMS, '3001234567', 'Test message');

      // Assert
      expect(notification.channel).toBe(NotificationChannel.SMS);
      expect(notification.value).toBe('3001234567');
      expect(notification.message).toBe('Test message');
    });
  });

  describe('forSuccessTransfer', () => {
    it('should create Notification with all properties correctly formatted', () => {
      // Arrange
      const transactionTime = new Date('2024-01-01T10:30:45');

      // Act
      const notification = Notification.forSuccessTransfer({
        value: '3001234567',
        companyName: 'Empresa Test',
        amount: 1000000,
        formattedAccount: '1234',
        transactionTime,
        processor: PROCESSOR_BREB
      });

      // Assert
      expect(notification.channel).toBe(NotificationChannel.SMS);
      expect(notification.value).toBe('3001234567');
      expect(notification.message).toContain('Empresa Test');
      expect(notification.message).toContain('1.000.000');
      expect(notification.message).toContain('1234');
      expect(notification.message).toContain('10:30:45');
      expect(notification.message).toContain(PROCESSOR_BREB);
      expect(notification.message).toMatch(
        /Empresa Test Abono \$1\.000\.000 a Cta de Ahorros \*1234\. Hora: 10:30:45\. Procesada por Bre-B/
      );
    });

    it('should use empty string for formattedAccount when not provided', () => {
      // Arrange
      const transactionTime = new Date('2024-01-01T10:30:45');

      // Act
      const notification = Notification.forSuccessTransfer({
        value: '3001234567',
        companyName: 'Empresa Test',
        amount: 1000,
        formattedAccount: '',
        transactionTime,
        processor: PROCESSOR_BREB
      });

      // Assert
      expect(notification.message).toContain('*');
      expect(notification.message).toMatch(/\*\./); // * seguido de punto
    });
  });
});
