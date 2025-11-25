import {
  CreateTransferRequestDto,
  CreateTransferResponseDto,
  AmountDto,
  ContextDto,
  AdditionalDataDto,
  TransactionDataDto,
  TransactionDto,
  TransactionPartiesResponseDto,
  MerchantResponseDto,
  NotificationDto
} from '~/modules/transfer/entrypoints/http/dto';
import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { TransferProps } from '~/modules/transfer/domain/models/transfer.model';
import {
  Amount,
  AdditionalData,
  TransferContext,
  TransactionKey,
  Transaction,
  TransactionParties
} from '~/modules/transfer/domain/value-objects';
import { AdditionalDataKey } from '~/modules/transfer/domain/constants/additional-data-key.enum';

export class TransferMapper {
  static toEntity(dto: CreateTransferRequestDto): Transfer {
    const additionalData = this.toAdditionalData(dto.additionalData);

    const sender = this.toTransaction(dto.transactionParties.payer);
    const recipient = this.toTransaction(dto.transactionParties.payee, dto.transactionParties.payee.key);
    const transactionParties = new TransactionParties(sender, recipient);

    const props: TransferProps = {
      amount: this.toAmount(dto.transaction.amount),
      description: dto.transaction.description,
      additionalData,
      context: this.toTransferContext(dto.context),
      transactionParties,
      transactionId: dto.transaction.transactionId
    };

    return Transfer.create(props);
  }

  static toCreateTransferResponseDto(
    transfer: Transfer,
    payerCustomerId?: string,
    payeeCustomerId?: string,
    merchantCustomerId?: string,
    notificationChannel?: string,
    notificationCellphone?: string,
    notificationMessage?: string
  ): CreateTransferResponseDto {
    const responseCode = transfer.additionalData?.get(AdditionalDataKey.RESPONSE_CODE) || 'TRANSACTION_PENDING';
    const message = transfer.additionalData?.get(AdditionalDataKey.RESPONSE_MESSAGE) || 'Transfer pending for provider';
    const transaction = this.toTransactionDto(transfer);
    const transactionParties = this.toTransactionPartiesResponseDto(transfer, payerCustomerId, payeeCustomerId);
    const merchant = this.toMerchantResponseDto(merchantCustomerId);
    const notification = this.toNotificationDto(
      transfer,
      notificationChannel,
      notificationCellphone,
      notificationMessage
    );
    const data: TransactionDataDto = {
      transaction,
      transactionParties,
      merchant,
      notification
    };

    return {
      transactionId: transfer.transactionId,
      responseCode,
      message,
      data
    };
  }

  private static toTransactionDto(transfer: Transfer): TransactionDto {
    return {
      amount: {
        value: transfer.amount.value,
        currency: transfer.amount.currency
      },
      description: transfer.description
    };
  }

  private static toTransactionPartiesResponseDto(
    transfer: Transfer,
    payerCustomerId?: string,
    payeeCustomerId?: string
  ): TransactionPartiesResponseDto {
    return {
      payer: {
        customerId: payerCustomerId || transfer.transactionParties.sender.customerId
      },
      payee: {
        customerId: payeeCustomerId || transfer.transactionParties.recipient.customerId
      }
    };
  }

  private static toMerchantResponseDto(merchantCustomerId?: string): MerchantResponseDto {
    return {
      customerId: merchantCustomerId || 'CUST-003'
    };
  }

  private static toNotificationDto(
    transfer: Transfer,
    notificationChannel?: string,
    notificationCellphone?: string,
    notificationMessage?: string
  ): NotificationDto {
    const recipientKey = transfer.transactionParties.recipient.key;
    const cellphone =
      recipientKey?.type === 'PHONE'
        ? recipientKey.value
        : transfer.additionalData?.get(AdditionalDataKey.CELLPHONE) || '3001234567';

    return {
      channel: notificationChannel || 'SMS',
      cellphone: notificationCellphone || cellphone,
      message:
        notificationMessage ||
        `Tu pago de $${transfer.amount.value} ${transfer.amount.currency} esta pendiente de confirmacion.`
    };
  }

  private static toAmount(amountDto: AmountDto): Amount {
    return new Amount(amountDto.value, amountDto.currency);
  }

  private static toAdditionalData(additionalDataDto?: AdditionalDataDto): AdditionalData | undefined {
    if (!additionalDataDto) {
      return undefined;
    }

    const additionalDataMap: Partial<Record<AdditionalDataKey, string>> = {};

    if (additionalDataDto[AdditionalDataKey.KEY]) {
      additionalDataMap[AdditionalDataKey.KEY] = additionalDataDto[AdditionalDataKey.KEY]!;
    }

    if (additionalDataDto[AdditionalDataKey.CELLPHONE]) {
      additionalDataMap[AdditionalDataKey.CELLPHONE] = additionalDataDto[AdditionalDataKey.CELLPHONE]!;
    }

    if (additionalDataDto[AdditionalDataKey.COMPANY_NAME]) {
      additionalDataMap[AdditionalDataKey.COMPANY_NAME] = additionalDataDto[AdditionalDataKey.COMPANY_NAME]!;
    }

    return Object.keys(additionalDataMap).length > 0 ? new AdditionalData(additionalDataMap) : undefined;
  }

  private static toTransferContext(contextDto: ContextDto): TransferContext {
    return new TransferContext(
      contextDto.pointOfSale,
      contextDto.terminal,
      contextDto.h2hPointOfSale,
      contextDto.transactionalPassword,
      contextDto.productCode,
      contextDto.trace
    );
  }

  private static toTransaction(
    party: { customerId: string; documentType: string; documentNumber: string },
    key?: { type: string; value: string }
  ): Transaction {
    const transactionKey = key ? new TransactionKey(key.type, key.value) : undefined;
    return new Transaction(party.customerId, party.documentType, party.documentNumber, transactionKey);
  }
}
