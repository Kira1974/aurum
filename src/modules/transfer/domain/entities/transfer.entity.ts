import { randomUUID } from 'node:crypto';

import { Amount, TransactionContext, TransactionParties, Notification } from '../value-objects';
import { AdditionalDataKey } from '../constants/additional-data-key.enum';
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
  readonly notification?: Notification;

  private constructor(props: TransferProps, notification?: Notification) {
    this.id = props.id ?? randomUUID();
    this.transactionId = props.transactionId;
    this.externalTransactionId = props.externalTransactionId ?? '';
    this.amount = props.amount;
    this.description = props.description;
    this.transactionParties = props.transactionParties;
    this.additionalData = props.additionalData;
    this.context = props.context;
    this.notification = notification;
  }

  static create(props: TransferProps, notification?: Notification): Transfer {
    return new Transfer(props, notification);
  }

  applyGatewayResult(transferGatewayResult: TransferGatewayResult, notification?: Notification): Transfer {
    const { externalTransactionId, responseCode, message = 'Unknown message' } = transferGatewayResult;
    const additionalData = {
      ...transferGatewayResult.additionalData,
      [AdditionalDataKey.RESPONSE_CODE]: responseCode,
      [AdditionalDataKey.RESPONSE_MESSAGE]: message //TODO
    };

    return Transfer.create(
      {
        id: this.id, //TODO
        transactionId: this.transactionId,
        externalTransactionId,
        amount: this.amount,
        description: this.description,
        transactionParties: this.transactionParties,
        additionalData,
        context: this.context
      },
      notification
    );
  }
}
