import { TransferProps } from '../models/transfer.model';
import { Amount, AdditionalData, TransferContext, TransactionParties, ProviderDecision } from '../value-objects';
export declare class Transfer {
    private readonly _id;
    private readonly _amount;
    private readonly _description;
    private readonly _additionalData?;
    private readonly _context;
    private readonly _transactionParties;
    private readonly _transactionId;
    private constructor();
    static create(params: TransferProps): Transfer;
    get id(): string;
    get amount(): Amount;
    get description(): string;
    get additionalData(): AdditionalData | undefined;
    get context(): TransferContext;
    get transactionParties(): TransactionParties;
    get transactionId(): string;
    applyProviderDecision(providerDecision: ProviderDecision): Transfer;
}
