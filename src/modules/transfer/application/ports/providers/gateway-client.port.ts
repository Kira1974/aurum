import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { TransferGatewayResult } from '~/modules/transfer/domain/types/transfer-gateway-result.type';

export interface IGatewayClient {
  createTransfer(transfer: Transfer): Promise<TransferGatewayResult>;
}
