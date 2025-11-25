export class TransactionKey {
  private readonly _type: string;
  private readonly _value: string;

  constructor(type: string, value: string) {
    this._type = type;
    this._value = value;
    this.validate();
  }

  private validate(): void {
    if (!this._type || this._type.trim().length === 0) {
      throw new Error('TransactionKey: type must not be empty');
    }
    if (!this._value || this._value.trim().length === 0) {
      throw new Error('TransactionKey: value must not be empty');
    }
  }

  get type(): string {
    return this._type;
  }

  get value(): string {
    return this._value;
  }

  equals(other: TransactionKey): boolean {
    return this._type === other._type && this._value === other._value;
  }
}
