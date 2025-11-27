import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';

import { CreateTransferResult } from '../../use-cases/create-transfer-result.type';

export interface ICreateTransferUseCase {
  execute(transfer: Transfer): Promise<CreateTransferResult>;
}
