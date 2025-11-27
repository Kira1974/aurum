import {
  InvalidAmountError,
  InvalidCurrencyError,
  InvalidTransactionPartyError,
  InvalidTransactionPartiesError,
  InvalidTransferContextError
} from '~/modules/transfer/domain/errors';
import { DomainError } from '~/shared/errors/domain-error.base';

describe('Value Object Validation Errors', () => {
  describe('InvalidAmountError', () => {
    it('should be instance of DomainError', () => {
      const error = new InvalidAmountError(0);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
    });

    it('should have correct code', () => {
      const error = new InvalidAmountError(0);
      expect(error.code).toBe('INVALID_AMOUNT');
    });

    it('should include amount in message', () => {
      const error = new InvalidAmountError(0);
      expect(error.message).toContain('Amount must be greater than 0');
      expect(error.message).toContain('0');
    });

    it('should include amount in details', () => {
      const amount = -100;
      const error = new InvalidAmountError(amount);
      expect(error.details).toStrictEqual({ amount });
    });
  });

  describe('InvalidCurrencyError', () => {
    it('should be instance of DomainError', () => {
      const error = new InvalidCurrencyError('USD');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
    });

    it('should have correct code', () => {
      const error = new InvalidCurrencyError('USD');
      expect(error.code).toBe('INVALID_CURRENCY');
    });

    it('should include currency in message', () => {
      const currency = 'USD';
      const error = new InvalidCurrencyError(currency);
      expect(error.message).toContain('Currency USD not supported');
    });

    it('should include currency in details', () => {
      const currency = 'EUR';
      const error = new InvalidCurrencyError(currency);
      expect(error.details).toStrictEqual({ currency });
    });
  });

  describe('InvalidTransactionPartyError', () => {
    it('should be instance of DomainError', () => {
      const error = new InvalidTransactionPartyError('customerId');
      expect(error).toBeInstanceOf(DomainError);
    });

    it('should have correct code', () => {
      const error = new InvalidTransactionPartyError('customerId');
      expect(error.code).toBe('INVALID_TRANSACTION_PARTY');
    });

    it('should include field in message', () => {
      const error = new InvalidTransactionPartyError('customerId');
      expect(error.message).toContain('Transaction: customerId must not be empty');
    });
  });

  describe('InvalidTransactionPartiesError', () => {
    it('should be instance of DomainError', () => {
      const error = new InvalidTransactionPartiesError('payee');
      expect(error).toBeInstanceOf(DomainError);
    });

    it('should have correct code', () => {
      const error = new InvalidTransactionPartiesError('payee');
      expect(error.code).toBe('INVALID_TRANSACTION_PARTIES');
    });

    it('should include field in message', () => {
      const error = new InvalidTransactionPartiesError('payee');
      expect(error.message).toContain('TransactionParties: payee must not be null');
    });
  });

  describe('InvalidTransferContextError', () => {
    it('should be instance of DomainError', () => {
      const error = new InvalidTransferContextError('pointOfSale');
      expect(error).toBeInstanceOf(DomainError);
    });

    it('should have correct code', () => {
      const error = new InvalidTransferContextError('pointOfSale');
      expect(error.code).toBe('INVALID_TRANSFER_CONTEXT');
    });

    it('should include field in message', () => {
      const error = new InvalidTransferContextError('pointOfSale');
      expect(error.message).toContain('TransferContext: pointOfSale must not be empty');
    });
  });
});
