import { Amount } from '~/modules/transfer/domain/value-objects/amount.vo';
import { InvalidAmountError, InvalidCurrencyError } from '~/modules/transfer/domain/errors';

describe('Amount', () => {
  describe('constructor', () => {
    it('should create an Amount with valid values', () => {
      const amount = new Amount(1000, 'COP');
      expect(amount.value).toBe(1000);
      expect(amount.currency).toBe('COP');
    });

    it('should throw InvalidAmountError when value is zero', () => {
      expect(() => new Amount(0, 'COP')).toThrow(InvalidAmountError);
      expect(() => new Amount(0, 'COP')).toThrow('Amount must be greater than 0');
    });

    it('should throw InvalidAmountError when value is negative', () => {
      expect(() => new Amount(-100, 'COP')).toThrow(InvalidAmountError);
      expect(() => new Amount(-100, 'COP')).toThrow('Amount must be greater than 0');
    });

    it('should throw InvalidCurrencyError when currency is not COP', () => {
      expect(() => new Amount(1000, 'USD')).toThrow(InvalidCurrencyError);
      expect(() => new Amount(1000, 'USD')).toThrow('Currency USD not supported');
    });

    it('should throw InvalidCurrencyError when currency is empty', () => {
      expect(() => new Amount(1000, '')).toThrow(InvalidCurrencyError);
      expect(() => new Amount(1000, '')).toThrow('Currency  not supported');
    });
  });
});
