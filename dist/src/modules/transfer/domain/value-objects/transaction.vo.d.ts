import { TransactionKey } from './transaction-key.vo';
export declare class Transaction {
    private readonly _customerId;
    private readonly _documentType;
    private readonly _documentNumber;
    private readonly _key?;
    constructor(customerId: string, documentType: string, documentNumber: string, key?: TransactionKey);
    private validate;
    private ensureNotBlank;
    get customerId(): string;
    get documentType(): string;
    get documentNumber(): string;
    get key(): TransactionKey | undefined;
    equals(other: Transaction): boolean;
}
