import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';

export interface ITransferRepository {
  save(transfer: Transfer): Promise<void>;
}
