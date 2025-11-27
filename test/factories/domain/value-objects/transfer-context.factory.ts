import { TransactionContext } from '~/modules/transfer/domain/value-objects/transaction-context.vo';

export class TransferContextFactory {
  static create(
    pointOfSale = 'POS-123',
    terminal = 'TERM-001',
    productCode = 'C79',
    trace = '3108de04'
  ): TransactionContext {
    return new TransactionContext(pointOfSale, terminal, productCode, trace);
  }
}
