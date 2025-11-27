import { randomUUID } from 'node:crypto';

import { Amount, TransactionContext, TransactionParties, Notification } from '../value-objects';
import { AdditionalDataKey } from '../constants/additional-data-key.enum';
import { TransferStatus } from '../constants/transfer-status.enum';
import { PROCESSOR_BREB } from '../constants/notification.constants';
import { TransferGatewayResult } from '../types/transfer-gateway-result.type';

export interface TransferProps {
  id?: string;
  externalTransactionId?: string;
  amount: Amount;
  description: string;
  additionalData?: Record<string, string>;
  context: TransactionContext;
  transactionParties: TransactionParties;
  transactionId: string;
  status?: TransferStatus;
}

export class Transfer {
  readonly id: string;
  readonly externalTransactionId: string;
  readonly amount: Amount;
  readonly description: string;
  readonly additionalData?: Record<string, string>;
  readonly context: TransactionContext;
  readonly transactionParties: TransactionParties;
  readonly transactionId: string;
  readonly status: TransferStatus;

  private constructor(props: TransferProps) {
    this.id = props.id ?? randomUUID();
    this.transactionId = props.transactionId;
    this.externalTransactionId = props.externalTransactionId ?? '';
    this.amount = props.amount;
    this.description = props.description;
    this.transactionParties = props.transactionParties;
    this.additionalData = props.additionalData;
    this.context = props.context;
    this.status = props.status ?? TransferStatus.PENDING;
  }

  static create(props: TransferProps): Transfer {
    return new Transfer(props);
  }

  applyGatewayResult(transferGatewayResult: TransferGatewayResult): Transfer {
    const { externalTransactionId, responseCode, message } = transferGatewayResult;
    const additionalData = {
      ...transferGatewayResult.additionalData,
      [AdditionalDataKey.RESPONSE_CODE]: responseCode,
      [AdditionalDataKey.RESPONSE_MESSAGE]: message
    };

    return Transfer.create({
      id: this.id,
      transactionId: this.transactionId,
      externalTransactionId,
      amount: this.amount,
      description: this.description,
      transactionParties: this.transactionParties,
      additionalData,
      context: this.context,
      status: responseCode
    });
  }

  getResponseCode(): TransferStatus | undefined {
    return this.additionalData?.[AdditionalDataKey.RESPONSE_CODE] as TransferStatus | undefined;
  }

  getMessage(): string | undefined {
    return this.additionalData?.[AdditionalDataKey.RESPONSE_MESSAGE];
  }

  buildNotificationIfNeeded(): Notification | null {
    if (this.status !== TransferStatus.SUCCESS) {
      return null;
    }

    if (!this.transactionParties.payee.cellphone || this.transactionParties.payee.cellphone.trim() === '') {
      return null;
    }

    const companyName = this.transactionParties.payee.name;
    const amount = this.amount.value;
    const formattedAccount = this.additionalData?.[AdditionalDataKey.ACCOUNT_NUMBER_KEY_RESOLUTION]?.slice(-4) || '';
    const transactionTime = new Date();
    const processor = PROCESSOR_BREB;

    return Notification.forSuccessTransfer({
      value: this.transactionParties.payee.cellphone,
      companyName,
      amount,
      formattedAccount,
      transactionTime,
      processor
    });
  }
}
