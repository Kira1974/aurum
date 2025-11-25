import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
export interface ICreateTransferUseCase {
    execute(transfer: Transfer): Promise<Transfer>;
}
