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
export declare class GatewayClientMapper {
    static toGatewayRequest(transfer: Transfer): CredClientRequest;
    static toProviderDecision(credResponse: CredClientResponse): ProviderDecision;
}
