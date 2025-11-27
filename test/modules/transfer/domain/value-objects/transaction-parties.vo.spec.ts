import { TransactionParties } from '~/modules/transfer/domain/value-objects/transaction-parties.vo';
import { TransactionParty } from '~/modules/transfer/domain/value-objects/transaction-party.vo';
import { AccountInfo } from '~/modules/transfer/domain/value-objects/account-info.vo';
import { InvalidTransactionPartiesError } from '~/modules/transfer/domain/errors';

describe('TransactionParties', () => {
  const createPayer = (): TransactionParty => {
    return new TransactionParty('CUST-001', 'CC', '1234567890', 'Payer Name', '3001234567');
  };

  const createPayee = (): TransactionParty => {
    return new TransactionParty(
      'CUST-002',
      'CC',
      '0987654321',
      'Payee Name',
      '3007654321',
      new AccountInfo('ACCOUNT-001')
    );
  };

  describe('constructor', () => {
    it('should create TransactionParties with valid payer and payee', () => {
      const payer = createPayer();
      const payee = createPayee();
      const parties = new TransactionParties(payer, payee);

      expect(parties.payer).toStrictEqual(payer);
      expect(parties.payee).toStrictEqual(payee);
    });

    it('should create TransactionParties without payer', () => {
      const payee = createPayee();
      const parties = new TransactionParties(undefined, payee);

      expect(parties.payer).toBeUndefined();
      expect(parties.payee).toStrictEqual(payee);
    });

    it('should throw InvalidTransactionPartiesError when payee does not have accountInfo', () => {
      const payer = createPayer();
      const payeeWithoutAccountInfo = new TransactionParty('CUST-002', 'CC', '0987654321', 'Payee Name', '3007654321');
      expect(() => new TransactionParties(payer, payeeWithoutAccountInfo)).toThrow(InvalidTransactionPartiesError);
      expect(() => new TransactionParties(payer, payeeWithoutAccountInfo)).toThrow(
        'TransactionParties: payee.accountInfo must not be null'
      );
    });

    it('should throw InvalidTransactionPartiesError when payee without accountInfo and without payer', () => {
      const payeeWithoutAccountInfo = new TransactionParty('CUST-002', 'CC', '0987654321', 'Payee Name', '3007654321');
      expect(() => new TransactionParties(undefined, payeeWithoutAccountInfo)).toThrow(InvalidTransactionPartiesError);
      expect(() => new TransactionParties(undefined, payeeWithoutAccountInfo)).toThrow(
        'TransactionParties: payee.accountInfo must not be null'
      );
    });
  });
});
