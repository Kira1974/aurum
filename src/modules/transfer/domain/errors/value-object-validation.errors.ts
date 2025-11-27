import { DomainError } from '~/shared/errors/domain-error.base';

import { AdditionalDataKey } from '../constants/additional-data-key.enum';

export class InvalidAmountError extends DomainError {
  readonly code = 'INVALID_AMOUNT';

  constructor(amount: number) {
    super(`Amount must be greater than 0, received: ${amount}`, { amount });
  }
}

export class InvalidCurrencyError extends DomainError {
  readonly code = 'INVALID_CURRENCY';

  constructor(currency: string) {
    super(`Currency ${currency} not supported`, { currency });
  }
}

export class InvalidTransactionPartyError extends DomainError {
  readonly code = 'INVALID_TRANSACTION_PARTY';

  constructor(field: string, value?: string) {
    super(`Transaction: ${field} must not be empty`, { field, value });
  }
}

export class InvalidTransactionPartiesError extends DomainError {
  readonly code = 'INVALID_TRANSACTION_PARTIES';

  constructor(field: 'payer' | 'payee' | 'payee.accountInfo') {
    super(`TransactionParties: ${field} must not be null`, { field });
  }
}

export class InvalidTransferContextError extends DomainError {
  readonly code = 'INVALID_TRANSFER_CONTEXT';

  constructor(field: string, value?: string) {
    super(`TransferContext: ${field} must not be empty`, { field, value });
  }
}

export class InvalidAdditionalDataError extends DomainError {
  readonly code = 'INVALID_ADDITIONAL_DATA';

  constructor(key: AdditionalDataKey) {
    super(`AdditionalData: Value for key ${key} must be a non-empty string`, { key });
  }
}
