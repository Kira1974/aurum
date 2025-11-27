import { TransactionParty } from '~/modules/transfer/domain/value-objects/transaction-party.vo';
import { AccountInfo } from '~/modules/transfer/domain/value-objects/account-info.vo';

describe('TransactionParty', () => {
  describe('constructor', () => {
    it('should create TransactionParty with valid values without accountInfo', () => {
      const transaction = new TransactionParty('CUST-001', 'CC', '1234567890', 'John Doe', '3001234567');
      expect(transaction.customerId).toBe('CUST-001');
      expect(transaction.documentType).toBe('CC');
      expect(transaction.documentNumber).toBe('1234567890');
      expect(transaction.name).toBe('John Doe');
      expect(transaction.cellphone).toBe('3001234567');
      expect(transaction.accountInfo).toBeUndefined();
    });

    it('should create TransactionParty with valid values with accountInfo', () => {
      const accountInfo = new AccountInfo('ACCOUNT-001');
      const transaction = new TransactionParty('CUST-001', 'CC', '1234567890', 'John Doe', '3001234567', accountInfo);
      expect(transaction.customerId).toBe('CUST-001');
      expect(transaction.documentType).toBe('CC');
      expect(transaction.documentNumber).toBe('1234567890');
      expect(transaction.name).toBe('John Doe');
      expect(transaction.cellphone).toBe('3001234567');
      expect(transaction.accountInfo).toStrictEqual(accountInfo);
    });

    it('should create TransactionParty with empty strings (no validation)', () => {
      const transaction = new TransactionParty('', '', '', '', '');
      expect(transaction.customerId).toBe('');
      expect(transaction.documentType).toBe('');
      expect(transaction.documentNumber).toBe('');
      expect(transaction.name).toBe('');
      expect(transaction.cellphone).toBe('');
      expect(transaction.accountInfo).toBeUndefined();
    });
  });
});
