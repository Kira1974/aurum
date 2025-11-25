import { TransactionKey } from './transaction-key.vo';

export class Transaction {
  private readonly _customerId: string;
  private readonly _documentType: string;
  private readonly _documentNumber: string;
  private readonly _key?: TransactionKey;

  constructor(customerId: string, documentType: string, documentNumber: string, key?: TransactionKey) {
    this._customerId = customerId;
    this._documentType = documentType;
    this._documentNumber = documentNumber;
    this._key = key;
    this.validate();
  }

  private validate(): void {
    this.ensureNotBlank('customerId', this._customerId);
    this.ensureNotBlank('documentType', this._documentType);
    this.ensureNotBlank('documentNumber', this._documentNumber);
  }

  private ensureNotBlank(field: string, value: string | null | undefined): void {
    if (!value || value.trim().length === 0) {
      throw new Error(`Transaction: ${field} must not be empty`);
    }
  }

  get customerId(): string {
    return this._customerId;
  }

  get documentType(): string {
    return this._documentType;
  }

  get documentNumber(): string {
    return this._documentNumber;
  }

  get key(): TransactionKey | undefined {
    return this._key;
  }

  equals(other: Transaction): boolean {
    return (
      this._customerId === other._customerId &&
      this._documentType === other._documentType &&
      this._documentNumber === other._documentNumber &&
      (this._key?.equals(other._key || new TransactionKey('', '')) ?? !other._key)
    );
  }
}
