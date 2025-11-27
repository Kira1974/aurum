import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';

import { TransferFactory } from '../../../factories/domain/entities/transfer.factory';
import { TransactionPartiesFactory } from '../../../factories/domain/value-objects/transaction-parties.factory';

export class TransferMother {
  static valid(): Transfer {
    return TransferFactory.create();
  }

  static withAccountInfo(): Transfer {
    return TransferFactory.create({
      transactionParties: TransactionPartiesFactory.create('CUST-001', 'CUST-002')
    });
  }

  static withoutAccountInfo(): Transfer {
    return TransferFactory.create({
      transactionParties: TransactionPartiesFactory.createWithoutPayer('CUST-002')
    });
  }
}
