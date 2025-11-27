import { InvalidTransactionPartiesError } from '../errors';

import { TransactionParty } from './transaction-party.vo';

export class TransactionParties {
  readonly payer?: TransactionParty;
  readonly payee: TransactionParty;

  constructor(payer: TransactionParty | undefined, payee: TransactionParty) {
    if (!payee.accountInfo) {
      throw new InvalidTransactionPartiesError('payee.accountInfo');
    }
    this.payer = payer;
    this.payee = payee;
  }
}
