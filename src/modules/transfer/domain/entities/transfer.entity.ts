import { randomUUID } from 'node:crypto';

import { TransferProps } from '../models/transfer.model';
import { Amount, AdditionalData, TransferContext, TransactionParties, ProviderDecision } from '../value-objects';
import { AdditionalDataKey } from '../constants/additional-data-key.enum';

export class Transfer {
  private readonly _id: string;
  private readonly _amount: Amount;
  private readonly _description: string;
  private readonly _additionalData?: AdditionalData;
  private readonly _context: TransferContext;
  private readonly _transactionParties: TransactionParties;
  private readonly _transactionId: string;

  private constructor(props: TransferProps) {
    this._id = props.id || randomUUID();
    this._amount = props.amount;
    this._description = props.description;
    this._additionalData = props.additionalData;
    this._context = props.context;
    this._transactionParties = props.transactionParties;
    this._transactionId = props.transactionId;
  }

  static create(params: TransferProps): Transfer {
    return new Transfer(params);
  }

  get id(): string {
    return this._id;
  }

  get amount(): Amount {
    return this._amount;
  }

  get description(): string {
    return this._description;
  }

  get additionalData(): AdditionalData | undefined {
    return this._additionalData;
  }

  get context(): TransferContext {
    return this._context;
  }

  get transactionParties(): TransactionParties {
    return this._transactionParties;
  }

  get transactionId(): string {
    return this._transactionId;
  }

  applyProviderDecision(providerDecision: ProviderDecision): Transfer {
    const responseCode = 'TRANSACTION_PENDING';
    const responseMessage = providerDecision.message || 'Transaction pending confirmation';

    const currentData = this._additionalData?.toObject() || {};
    const updatedAdditionalData = new AdditionalData({
      ...currentData,
      [AdditionalDataKey.RESPONSE_CODE]: responseCode,
      [AdditionalDataKey.RESPONSE_MESSAGE]: responseMessage
    });

    return Transfer.create({
      id: this._id,
      amount: this._amount,
      description: this._description,
      additionalData: updatedAdditionalData,
      context: this._context,
      transactionParties: this._transactionParties,
      transactionId: this._transactionId
    });
  }
}
