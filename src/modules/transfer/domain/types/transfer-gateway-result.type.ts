import { TransferStatus } from '../constants/transfer-status.enum';

export interface TransferGatewayResult {
  transactionId: string;
  externalTransactionId: string;
  responseCode: TransferStatus;
  message: string;
  additionalData?: Record<string, string>;
}
