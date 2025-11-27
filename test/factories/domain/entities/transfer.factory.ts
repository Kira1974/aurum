import { Transfer, TransferProps } from '~/modules/transfer/domain/entities/transfer.entity';

import { AmountFactory, TransferContextFactory, TransactionPartiesFactory } from '../value-objects';

export class TransferFactory {
  static create(overrides?: Partial<TransferProps>): Transfer {
    const props: TransferProps = {
      amount: AmountFactory.create(),
      description: 'Test transfer',
      context: TransferContextFactory.create(),
      transactionParties: TransactionPartiesFactory.create(),
      transactionId: 'TX-001',
      ...overrides
    };
    return Transfer.create(props);
  }

  static createWithTransactionId(transactionId: string): Transfer {
    return this.create({ transactionId });
  }
}
