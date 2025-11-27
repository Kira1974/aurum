import { Transfer, TransferProps } from '~/modules/transfer/domain/entities/transfer.entity';
import { Notification } from '~/modules/transfer/domain/value-objects/notification.vo';

import { AmountFactory, TransferContextFactory, TransactionPartiesFactory } from '../value-objects';

export class TransferFactory {
  static create(overrides?: Partial<TransferProps>, notification?: Notification): Transfer {
    const props: TransferProps = {
      amount: AmountFactory.create(),
      description: 'Test transfer',
      context: TransferContextFactory.create(),
      transactionParties: TransactionPartiesFactory.create(),
      transactionId: 'TX-001',
      ...overrides
    };
    return Transfer.create(props, notification);
  }

  static createWithTransactionId(transactionId: string): Transfer {
    return this.create({ transactionId });
  }
}
