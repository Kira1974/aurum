export class Amount {
  private readonly _value: number;
  private readonly _currency: string;

  constructor(value: number, currency: string) {
    this._value = value;
    this._currency = currency;
    this.validate();
  }

  private validate(): void {
    if (this._value <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (this._currency !== 'COP') {
      throw new Error(`Currency ${this._currency} not supported`);
    }
  }

  get value(): number {
    return this._value;
  }

  get currency(): string {
    return this._currency;
  }

  equals(other: Amount): boolean {
    return this._value === other._value && this._currency === other._currency;
  }
}
