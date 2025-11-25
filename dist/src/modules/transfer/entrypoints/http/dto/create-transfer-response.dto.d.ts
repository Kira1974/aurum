import { TransactionDataDto } from './transaction-data.dto';
export declare class CreateTransferResponseDto {
    transactionId: string;
    responseCode: string;
    message: string;
    data: TransactionDataDto;
}
