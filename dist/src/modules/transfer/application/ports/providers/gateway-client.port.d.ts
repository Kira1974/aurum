import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { ProviderDecision } from '~/modules/transfer/domain/value-objects';
export interface IGatewayClient {
    createTransfer(transfer: Transfer): Promise<ProviderDecision>;
}
