import { ContextDto } from './context.dto';
import { TransactionRequestDto } from './transaction-request.dto';
import { TransactionPartiesRequestDto } from './transaction-parties-request.dto';
import { AdditionalDataDto } from './additional-data.dto';
export declare class CreateTransferRequestDto {
    context: ContextDto;
    transaction: TransactionRequestDto;
    transactionParties: TransactionPartiesRequestDto;
    additionalData?: AdditionalDataDto;
}
