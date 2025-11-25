import { Amount, AdditionalData, TransferContext, TransactionParties } from '../value-objects';
export interface TransferProps {
    id?: string;
    amount: Amount;
    description: string;
    additionalData?: AdditionalData;
    context: TransferContext;
    transactionParties: TransactionParties;
    transactionId: string;
}
