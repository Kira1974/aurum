import { TransactionContext } from '~/modules/transfer/domain/value-objects/transaction-context.vo';
import { InvalidTransferContextError } from '~/modules/transfer/domain/errors';

describe('TransactionContext', () => {
  const validContextParams = {
    pointOfSale: 'POS-123',
    terminal: 'TERM-001',
    h2hPointOfSale: 'H2H-77',
    transactionalPassword: 'password123',
    productCode: 'C79',
    trace: '3108de04'
  };

  describe('constructor', () => {
    it('should create TransactionContext with valid values', () => {
      const context = new TransactionContext(
        validContextParams.pointOfSale,
        validContextParams.terminal,
        validContextParams.productCode,
        validContextParams.trace
      );

      expect(context.pointOfSale).toBe(validContextParams.pointOfSale);
      expect(context.terminal).toBe(validContextParams.terminal);
      expect(context.productCode).toBe(validContextParams.productCode);
      expect(context.trace).toBe(validContextParams.trace);
    });

    it('should throw InvalidTransferContextError when pointOfSale is empty', () => {
      expect(
        () =>
          new TransactionContext(
            '',
            validContextParams.terminal,
            validContextParams.productCode,
            validContextParams.trace
          )
      ).toThrow(InvalidTransferContextError);
      expect(
        () =>
          new TransactionContext(
            '',
            validContextParams.terminal,
            validContextParams.productCode,
            validContextParams.trace
          )
      ).toThrow('TransferContext: pointOfSale must not be empty');
    });

    it('should throw InvalidTransferContextError when terminal is empty', () => {
      expect(
        () =>
          new TransactionContext(
            validContextParams.pointOfSale,
            '',
            validContextParams.productCode,
            validContextParams.trace
          )
      ).toThrow(InvalidTransferContextError);
      expect(
        () =>
          new TransactionContext(
            validContextParams.pointOfSale,
            '',
            validContextParams.productCode,
            validContextParams.trace
          )
      ).toThrow('TransferContext: terminal must not be empty');
    });

    it('should throw error when productCode is empty', () => {
      expect(
        () =>
          new TransactionContext(
            validContextParams.pointOfSale,
            validContextParams.terminal,
            '',
            validContextParams.trace
          )
      ).toThrow('TransferContext: productCode must not be empty');
    });

    it('should throw error when trace is empty', () => {
      expect(
        () =>
          new TransactionContext(
            validContextParams.pointOfSale,
            validContextParams.terminal,
            validContextParams.productCode,
            ''
          )
      ).toThrow('TransferContext: trace must not be empty');
    });

    it('should throw error when value is whitespace only', () => {
      expect(
        () =>
          new TransactionContext(
            '   ',
            validContextParams.terminal,
            validContextParams.productCode,
            validContextParams.trace
          )
      ).toThrow('TransferContext: pointOfSale must not be empty');
    });
  });
});
