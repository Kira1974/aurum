import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { TransferGatewayResult } from '~/modules/transfer/domain/types/transfer-gateway-result.type';
import { TransferStatus } from '~/modules/transfer/domain/constants/transfer-status.enum';

import { GatewayClientRequest, GatewayClientResponse } from './gateway.type';

export class GatewayClientMapper {
  static toGatewayRequest(transfer: Transfer): GatewayClientRequest {
    const payer = transfer.transactionParties.payer;
    const payee = transfer.transactionParties.payee;

    return {
      transactionId: transfer.transactionId,
      transaction: {
        amount: {
          value: transfer.amount.value,
          currency: transfer.amount.currency
        },
        description: transfer.description
      },
      transactionParties: {
        ...(payer && {
          payer: {
            customerId: payer.customerId,
            documentType: payer.documentType,
            documentNumber: payer.documentNumber
          }
        }),
        payee: {
          customerId: payee.customerId,
          documentType: payee.documentType,
          documentNumber: payee.documentNumber,
          accountInfo: {
            value: payee.accountInfo!.value
          }
        }
      },
      additionalData: transfer.additionalData || {}
    };
  }

  static toTransferGatewayResult(response: GatewayClientResponse): TransferGatewayResult {
    return {
      transactionId: response.transactionId,
      externalTransactionId: response.externalTransactionId,
      responseCode: response.responseCode as TransferStatus,
      message: response.message,
      additionalData: response.additionalData
    };
  }
}
