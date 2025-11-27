import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { Amount } from '~/modules/transfer/domain/value-objects/amount.vo';
import { TransactionContext } from '~/modules/transfer/domain/value-objects/transaction-context.vo';
import { TransactionParties } from '~/modules/transfer/domain/value-objects/transaction-parties.vo';
import { TransactionParty } from '~/modules/transfer/domain/value-objects/transaction-party.vo';
import { AccountInfo } from '~/modules/transfer/domain/value-objects/account-info.vo';
import { AdditionalDataKey } from '~/modules/transfer/domain/constants/additional-data-key.enum';
import { TransferStatus } from '~/modules/transfer/domain/constants/transfer-status.enum';
import { TransferGatewayResult } from '~/modules/transfer/domain/types/transfer-gateway-result.type';

describe('Transfer', () => {
  describe('create', () => {
    it('should create Transfer with all required properties', () => {
      // Arrange
      const amount = new Amount(1000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payer = new TransactionParty('CUST-001', 'CC', '1234567890', 'Payer Name', '3001234567');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '3007654321',
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(payer, payee);

      // Act
      const transfer = Transfer.create({
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001'
      });

      // Assert
      expect(transfer).toBeInstanceOf(Transfer);
      expect(transfer.amount).toStrictEqual(amount);
      expect(transfer.description).toBe('Test transfer');
      expect(transfer.context).toStrictEqual(context);
      expect(transfer.transactionParties).toStrictEqual(transactionParties);
      expect(transfer.transactionId).toBe('TX-001');
      expect(transfer.id).toBeDefined();
      expect(transfer.additionalData).toBeUndefined();
    });

    it('should create Transfer with optional id', () => {
      // Arrange
      const amount = new Amount(1000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payer = new TransactionParty('CUST-001', 'CC', '1234567890', 'Payer Name', '3001234567');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '3007654321',
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(payer, payee);

      // Act
      const transfer = Transfer.create({
        id: 'custom-id-123',
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001'
      });

      // Assert
      expect(transfer.id).toBe('custom-id-123');
    });

    it('should generate unique id when not provided', () => {
      // Arrange
      const amount = new Amount(1000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payer = new TransactionParty('CUST-001', 'CC', '1234567890', 'Payer Name', '3001234567');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '3007654321',
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(payer, payee);
      const props = {
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001'
      };

      // Act
      const transfer1 = Transfer.create(props);
      const transfer2 = Transfer.create(props);

      // Assert
      expect(transfer1.id).toBeDefined();
      expect(transfer1.id).toBeTruthy();
      expect(transfer2.id).toBeDefined();
      expect(transfer2.id).toBeTruthy();
      expect(transfer1.id).not.toBe(transfer2.id);
    });

    it('should create Transfer with optional additionalData', () => {
      // Arrange
      const amount = new Amount(1000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payer = new TransactionParty('CUST-001', 'CC', '1234567890', 'Payer Name', '3001234567');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '3007654321',
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(payer, payee);
      const additionalData = {
        [AdditionalDataKey.DOCUMENT_NUMBER_KEY_RESOLUTION]: '3001234567'
      };

      // Act
      const transfer = Transfer.create({
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001',
        additionalData
      });

      // Assert
      expect(transfer.additionalData).toStrictEqual(additionalData);
    });

    it('should create Transfer without payer', () => {
      // Arrange
      const amount = new Amount(1000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '3007654321',
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(undefined, payee);

      // Act
      const transfer = Transfer.create({
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001'
      });

      // Assert
      expect(transfer.transactionParties.payer).toBeUndefined();
      expect(transfer.transactionParties.payee).toStrictEqual(payee);
    });
  });

  describe('applyGatewayResult', () => {
    const createTransfer = (additionalData?: Record<string, string>): Transfer => {
      const amount = new Amount(1000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payer = new TransactionParty('CUST-001', 'CC', '1234567890', 'Payer Name', '3001234567');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '3007654321',
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(payer, payee);

      return Transfer.create({
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001',
        additionalData
      });
    };

    it('should return new Transfer instance with responseCode and message in additionalData', () => {
      // Arrange
      const transfer = createTransfer();
      const gatewayResult: TransferGatewayResult = {
        transactionId: 'TX-001',
        externalTransactionId: 'EXT-001',
        responseCode: TransferStatus.SUCCESS,
        message: 'Transaction completed'
      };

      // Act
      const result = transfer.applyGatewayResult(gatewayResult);

      // Assert
      expect(result).toBeInstanceOf(Transfer);
      expect(result).not.toBe(transfer);
      expect(result.id).toBe(transfer.id);
      expect(result.externalTransactionId).toBe('EXT-001');
      expect(result.additionalData?.[AdditionalDataKey.RESPONSE_CODE]).toBe('SUCCESS');
      expect(result.additionalData?.[AdditionalDataKey.RESPONSE_MESSAGE]).toBe('Transaction completed');
    });

    it('should preserve all original transfer properties', () => {
      // Arrange
      const transfer = createTransfer();
      const gatewayResult: TransferGatewayResult = {
        transactionId: 'TX-001',
        externalTransactionId: 'EXT-001',
        responseCode: TransferStatus.SUCCESS,
        message: 'Transaction completed'
      };

      // Act
      const result = transfer.applyGatewayResult(gatewayResult);

      // Assert
      expect(result.amount).toStrictEqual(transfer.amount);
      expect(result.description).toBe(transfer.description);
      expect(result.context).toStrictEqual(transfer.context);
      expect(result.transactionParties).toStrictEqual(transfer.transactionParties);
      expect(result.transactionId).toBe(transfer.transactionId);
    });

    it('should use gateway result message in additionalData', () => {
      // Arrange
      const transfer = createTransfer();
      const gatewayResult: TransferGatewayResult = {
        transactionId: 'TX-001',
        externalTransactionId: 'EXT-001',
        responseCode: TransferStatus.SUCCESS,
        message: 'Custom message from provider'
      };

      // Act
      const result = transfer.applyGatewayResult(gatewayResult);

      // Assert
      expect(result.additionalData?.[AdditionalDataKey.RESPONSE_MESSAGE]).toBe('Custom message from provider');
    });

    it('should maintain immutability - original transfer should not be modified', () => {
      // Arrange
      const transfer = createTransfer();
      const gatewayResult: TransferGatewayResult = {
        transactionId: 'TX-001',
        externalTransactionId: 'EXT-001',
        responseCode: TransferStatus.SUCCESS,
        message: 'Transaction completed'
      };
      const originalAdditionalData = transfer.additionalData;

      // Act
      const result = transfer.applyGatewayResult(gatewayResult);

      // Assert
      expect(transfer.additionalData).toBe(originalAdditionalData);
      expect(transfer.additionalData).not.toBe(result.additionalData);
      expect(result.additionalData).toBeDefined();
    });

    it('should create additionalData when transfer has no additionalData', () => {
      // Arrange
      const transfer = createTransfer();
      const gatewayResult: TransferGatewayResult = {
        transactionId: 'TX-001',
        externalTransactionId: 'EXT-001',
        responseCode: TransferStatus.SUCCESS,
        message: 'Transaction completed'
      };

      // Act
      const result = transfer.applyGatewayResult(gatewayResult);

      // Assert
      expect(transfer.additionalData).toBeUndefined();
      expect(result.additionalData).toBeDefined();
      expect(result.additionalData?.[AdditionalDataKey.RESPONSE_CODE]).toBe('SUCCESS');
      expect(result.additionalData?.[AdditionalDataKey.RESPONSE_MESSAGE]).toBe('Transaction completed');
    });

    it('should update externalTransactionId', () => {
      // Arrange
      const transfer = createTransfer();
      const gatewayResult: TransferGatewayResult = {
        transactionId: 'TX-001',
        externalTransactionId: 'EXT-12345',
        responseCode: TransferStatus.SUCCESS,
        message: 'Transaction completed'
      };

      // Act
      const result = transfer.applyGatewayResult(gatewayResult);

      // Assert
      expect(result.externalTransactionId).toBe('EXT-12345');
      expect(transfer.externalTransactionId).toBe('');
    });

    it('should map responseCode from gateway to status in domain', () => {
      // Arrange
      const transfer = createTransfer();
      const gatewayResult: TransferGatewayResult = {
        transactionId: 'TX-001',
        externalTransactionId: 'EXT-001',
        responseCode: TransferStatus.SUCCESS,
        message: 'Transaction completed'
      };

      // Act
      const result = transfer.applyGatewayResult(gatewayResult);

      // Assert
      expect(result.status).toBe(TransferStatus.SUCCESS);
      expect(result.additionalData?.[AdditionalDataKey.RESPONSE_CODE]).toBe('SUCCESS');
    });

    it('should have PENDING as default status when creating transfer', () => {
      // Arrange & Act
      const transfer = createTransfer();

      // Assert
      expect(transfer.status).toBe(TransferStatus.PENDING);
    });
  });

  describe('getResponseCode', () => {
    const createTransfer = (additionalData?: Record<string, string>): Transfer => {
      const amount = new Amount(1000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payer = new TransactionParty('CUST-001', 'CC', '1234567890', 'Payer Name', '3001234567');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '3007654321',
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(payer, payee);

      return Transfer.create({
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001',
        additionalData
      });
    };

    it('should return responseCode from additionalData when exists', () => {
      // Arrange
      const transfer = createTransfer({
        [AdditionalDataKey.RESPONSE_CODE]: TransferStatus.SUCCESS
      });

      // Act
      const result = transfer.getResponseCode();

      // Assert
      expect(result).toBe(TransferStatus.SUCCESS);
    });

    it('should return undefined when responseCode does not exist in additionalData', () => {
      // Arrange
      const transfer = createTransfer();

      // Act
      const result = transfer.getResponseCode();

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('getMessage', () => {
    const createTransfer = (additionalData?: Record<string, string>): Transfer => {
      const amount = new Amount(1000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payer = new TransactionParty('CUST-001', 'CC', '1234567890', 'Payer Name', '3001234567');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '3007654321',
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(payer, payee);

      return Transfer.create({
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001',
        additionalData
      });
    };

    it('should return message from additionalData when exists', () => {
      // Arrange
      const transfer = createTransfer({
        [AdditionalDataKey.RESPONSE_MESSAGE]: 'Transaction completed'
      });

      // Act
      const result = transfer.getMessage();

      // Assert
      expect(result).toBe('Transaction completed');
    });

    it('should return undefined when message does not exist in additionalData', () => {
      // Arrange
      const transfer = createTransfer();

      // Act
      const result = transfer.getMessage();

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('buildNotificationIfNeeded', () => {
    const createTransfer = (status?: TransferStatus): Transfer => {
      const amount = new Amount(1000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '3007654321',
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(undefined, payee);

      return Transfer.create({
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001',
        status
      });
    };

    it('should return Notification when status is SUCCESS and payee cellphone is provided', () => {
      // Arrange
      const transfer = createTransfer(TransferStatus.SUCCESS);
      expect(transfer.status).toBe(TransferStatus.SUCCESS);
      expect(transfer.transactionParties.payee.cellphone).toBe('3007654321');

      // Act
      const result = transfer.buildNotificationIfNeeded();

      // Assert
      expect(result).not.toBeNull();
      expect(result!.channel).toBe('SMS');
      expect(result!.value).toBe('3007654321');
      expect(result!.message).toContain('Payee Name');
      expect(result!.message).toContain('1.000');
      expect(result!.message).toContain('Bre-B');
      expect(result!.message).toMatch(/Hora: \d{2}:\d{2}:\d{2}/);
    });

    it('should extract last 4 digits from ACCOUNT_NUMBER_KEY_RESOLUTION when available', () => {
      // Arrange
      const amount = new Amount(5000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '3007654321',
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(undefined, payee);
      const transfer = Transfer.create({
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001',
        status: TransferStatus.SUCCESS,
        additionalData: {
          [AdditionalDataKey.ACCOUNT_NUMBER_KEY_RESOLUTION]: '1234567890'
        }
      });

      // Act
      const result = transfer.buildNotificationIfNeeded();

      // Assert
      expect(result).not.toBeNull();
      expect(result!.message).toContain('*7890');
    });

    it('should use empty string for account digits when ACCOUNT_NUMBER_KEY_RESOLUTION is not available', () => {
      // Arrange
      const transfer = createTransfer(TransferStatus.SUCCESS);

      // Act
      const result = transfer.buildNotificationIfNeeded();

      // Assert
      expect(result).not.toBeNull();
      expect(result!.message).toMatch(/\*\./); // * seguido de punto cuando no hay dígitos
    });

    it('should return null when status is not SUCCESS', () => {
      // Arrange
      const transfer = createTransfer(TransferStatus.PENDING);

      // Act
      const result = transfer.buildNotificationIfNeeded();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when status is PENDING', () => {
      // Arrange
      const transfer = createTransfer(TransferStatus.PENDING);

      // Act
      const result = transfer.buildNotificationIfNeeded();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when status is SUCCESS but payee cellphone is not provided (empty)', () => {
      // Arrange
      const amount = new Amount(1000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '', // cellphone vacío (opcional, no viene)
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(undefined, payee);
      const transfer = Transfer.create({
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001',
        status: TransferStatus.SUCCESS
      });

      // Act
      const result = transfer.buildNotificationIfNeeded();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when status is SUCCESS but payee cellphone is only whitespace', () => {
      // Arrange
      const amount = new Amount(1000, 'COP');
      const context = new TransactionContext('POS-123', 'TERM-001', 'C79', '3108de04');
      const payee = new TransactionParty(
        'CUST-002',
        'CC',
        '0987654321',
        'Payee Name',
        '   ', // cellphone solo espacios (considerado como no proporcionado)
        new AccountInfo('ACCOUNT-001')
      );
      const transactionParties = new TransactionParties(undefined, payee);
      const transfer = Transfer.create({
        amount,
        description: 'Test transfer',
        context,
        transactionParties,
        transactionId: 'TX-001',
        status: TransferStatus.SUCCESS
      });

      // Act
      const result = transfer.buildNotificationIfNeeded();

      // Assert
      expect(result).toBeNull();
    });
  });
});
