import {
  CreateTransferRequestDto,
  CreateTransferResponseDto,
  AmountDto,
  ContextDto,
  TransactionDataDto,
  TransactionResponseDto,
  NotificationDto
} from '~/modules/transfer/entrypoints/http/dto';
import { Transfer, TransferProps } from '~/modules/transfer/domain/entities/transfer.entity';
import {
  Amount,
  TransactionContext,
  TransactionParty,
  TransactionParties,
  AccountInfo,
  Notification
} from '~/modules/transfer/domain/value-objects';
import { AdditionalDataKey } from '~/modules/transfer/domain/constants/additional-data-key.enum';
import { buildJsonFromEnum } from '~/shared/utils/util-json.util';

export class TransferMapper {
  static toEntity(dto: CreateTransferRequestDto): Transfer {
    const { context, transaction, additionalData, transactionParties } = dto;
    const { payer: payerIn, payee: payeeIn } = transactionParties;

    const payer = payerIn ? this.toTransactionParty(payerIn) : undefined;
    const payee = this.toTransactionParty(payeeIn, payeeIn.accountInfo);

    const props: TransferProps = {
      context: this.toTransactionContext(context),
      transactionId: transaction.transactionId,
      amount: this.toAmount(transaction.amount),
      description: transaction.description,
      transactionParties: new TransactionParties(payer, payee),
      additionalData: additionalData ? this.toAdditionalData(additionalData) : undefined
    };
    return Transfer.create(props);
  }

  static toCreateTransferResponseDto(transfer: Transfer, notification?: Notification): CreateTransferResponseDto {
    const responseCode = transfer.getResponseCode() ?? '';
    const message = transfer.getMessage() ?? '';
    const transaction = this.toTransactionResponseDto(transfer);

    const notificationDto = notification ? this.toNotificationDto(notification) : undefined;

    const additionalData = transfer.additionalData ? this.toAdditionalData(transfer.additionalData) : undefined;
    const data: TransactionDataDto = {
      transaction,
      notification: notificationDto,
      additionalData
    };

    return {
      responseCode,
      message,
      data
    };
  }

  private static toTransactionResponseDto(transfer: Transfer): TransactionResponseDto {
    return {
      transactionId: transfer.transactionId,
      externalTransactionId: transfer.externalTransactionId
    };
  }

  private static toNotificationDto(notification: Notification): NotificationDto[] {
    return [
      {
        channel: notification.channel,
        value: notification.value,
        message: notification.message
      }
    ];
  }

  private static toAmount(amountDto: AmountDto): Amount {
    return new Amount(amountDto.value, amountDto.currency);
  }

  private static toAdditionalData(additionalDataDto: Record<string, string>): Record<string, string> | undefined {
    const additionalDataMap = buildJsonFromEnum(additionalDataDto, AdditionalDataKey);
    if (!Object.keys(additionalDataMap).length) {
      return undefined;
    }
    return additionalDataMap;
  }

  private static toTransactionContext(contextDto: ContextDto): TransactionContext {
    return new TransactionContext(
      contextDto.pointOfSale,
      contextDto.terminal,
      contextDto.productCode,
      contextDto.trace
    );
  }

  private static toTransactionParty(
    party: {
      customerId?: string;
      documentType?: string;
      documentNumber?: string;
      name?: string;
      cellphone?: string;
    },
    accountInfoIn?: { value: string }
  ): TransactionParty {
    const { customerId = '', documentType = '', documentNumber = '', name = '', cellphone = '' } = party;

    const accountInfo = accountInfoIn?.value ? new AccountInfo(accountInfoIn.value) : undefined;

    return new TransactionParty(customerId, documentType, documentNumber, name, cellphone, accountInfo);
  }
}
