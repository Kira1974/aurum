import { CreateTransferRequestDto, CreateTransferResponseDto } from '~/modules/transfer/entrypoints/http/dto';
import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
export declare class TransferMapper {
    static toEntity(dto: CreateTransferRequestDto): Transfer;
    static toCreateTransferResponseDto(transfer: Transfer, payerCustomerId?: string, payeeCustomerId?: string, merchantCustomerId?: string, notificationChannel?: string, notificationCellphone?: string, notificationMessage?: string): CreateTransferResponseDto;
    private static toTransactionDto;
    private static toTransactionPartiesResponseDto;
    private static toMerchantResponseDto;
    private static toNotificationDto;
    private static toAmount;
    private static toAdditionalData;
    private static toTransferContext;
    private static toTransaction;
}
