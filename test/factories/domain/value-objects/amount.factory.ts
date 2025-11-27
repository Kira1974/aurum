import { Amount } from '~/modules/transfer/domain/value-objects/amount.vo';

export class AmountFactory {
  static create(value = 1000, currency = 'COP'): Amount {
    return new Amount(value, currency);
  }
}
