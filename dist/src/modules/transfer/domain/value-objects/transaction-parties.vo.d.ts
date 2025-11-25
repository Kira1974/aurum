import { Transaction } from './transaction.vo';
export declare class TransactionParties {
    private readonly _sender;
    private readonly _recipient;
    constructor(sender: Transaction, recipient: Transaction);
    private validate;
    get sender(): Transaction;
    get recipient(): Transaction;
    equals(other: TransactionParties): boolean;
}
