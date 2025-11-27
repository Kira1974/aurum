import { TransactionParties } from '~/modules/transfer/domain/value-objects/transaction-parties.vo';

import { TransactionFactory } from './transaction.factory';

export class TransactionPartiesFactory {
  static create(payerCustomerId = 'CUST-001', payeeCustomerId = 'CUST-002'): TransactionParties {
    const payer = TransactionFactory.createSender(payerCustomerId);
    const payee = TransactionFactory.createRecipient(payeeCustomerId);
    return new TransactionParties(payer, payee);
  }

  static createWithoutPayer(payeeCustomerId = 'CUST-002'): TransactionParties {
    const payee = TransactionFactory.createRecipient(payeeCustomerId);
    return new TransactionParties(undefined, payee);
  }
}
