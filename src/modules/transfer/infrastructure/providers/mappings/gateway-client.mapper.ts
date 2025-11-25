import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { ProviderDecision } from '~/modules/transfer/domain/value-objects';

export interface CredClientRequest {
  amount: {
    value: number;
    currency: string;
  };
  description: string;
  additionalData: Record<string, string>;
  transactionId: string;
}

export interface CredClientResponse {
  transactionId: string;
  responseCode: string;
  message: string;
  additionalData?: Record<string, string>;
}

export class GatewayClientMapper {
  static toGatewayRequest(transfer: Transfer): CredClientRequest {
    return {
      amount: {
        value: transfer.amount.value,
        currency: transfer.amount.currency
      },
      description: transfer.description,
      additionalData: transfer.additionalData?.toObject() || {},
      transactionId: transfer.transactionId
    };
  }

  static toProviderDecision(credResponse: CredClientResponse): ProviderDecision {
    return new ProviderDecision(credResponse.responseCode, credResponse.message, credResponse.additionalData);
  }
}
