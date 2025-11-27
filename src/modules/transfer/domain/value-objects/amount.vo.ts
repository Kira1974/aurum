import { InvalidAmountError, InvalidCurrencyError } from '../errors';

export class Amount {
  readonly value: number;
  readonly currency: string;

  constructor(value: number, currency: string) {
    this.value = value;
    this.currency = currency;
    this.validate();
  }

  private validate(): void {
    if (!Number.isFinite(this.value) || this.value <= 0) {
      throw new InvalidAmountError(this.value);
    }
    if (this.currency !== 'COP') {
      throw new InvalidCurrencyError(this.currency);
    }
  }
}
