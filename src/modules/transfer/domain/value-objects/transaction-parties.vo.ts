import { Transaction } from './transaction.vo';

export class TransactionParties {
  private readonly _sender: Transaction;
  private readonly _recipient: Transaction;

  constructor(sender: Transaction, recipient: Transaction) {
    this._sender = sender;
    this._recipient = recipient;
    this.validate();
  }

  private validate(): void {
    if (!this._sender) {
      throw new Error('TransactionParties: sender must not be null');
    }
    if (!this._recipient) {
      throw new Error('TransactionParties: recipient must not be null');
    }
  }

  get sender(): Transaction {
    return this._sender;
  }

  get recipient(): Transaction {
    return this._recipient;
  }

  equals(other: TransactionParties): boolean {
    return this._sender.equals(other._sender) && this._recipient.equals(other._recipient);
  }
}
