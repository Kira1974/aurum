import { TransactionDto } from './transaction.dto';
import { TransactionPartiesResponseDto } from './transaction-parties-response.dto';
import { MerchantResponseDto } from './merchant-response.dto';
import { NotificationDto } from './notification.dto';
export declare class TransactionDataDto {
    transaction: TransactionDto;
    transactionParties: TransactionPartiesResponseDto;
    merchant: MerchantResponseDto;
    notification: NotificationDto;
}
