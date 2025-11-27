import { TransactionParty } from '~/modules/transfer/domain/value-objects/transaction-party.vo';
import { AccountInfo } from '~/modules/transfer/domain/value-objects/account-info.vo';

export class TransactionFactory {
  static create(
    customerId = 'CUST-001',
    documentType = 'CC',
    documentNumber = '1234567890',
    name = 'Test User',
    cellphone = '3001234567',
    accountInfo?: AccountInfo
  ): TransactionParty {
    return new TransactionParty(customerId, documentType, documentNumber, name, cellphone, accountInfo);
  }

  static createSender(
    customerId = 'CUST-001',
    documentType = 'CC',
    documentNumber = '1234567890',
    name = 'Sender User',
    cellphone = '3001234567'
  ): TransactionParty {
    return new TransactionParty(customerId, documentType, documentNumber, name, cellphone);
  }

  static createRecipient(
    customerId = 'CUST-002',
    documentType = 'CC',
    documentNumber = '0987654321',
    name = 'Recipient User',
    cellphone = '3007654321',
    accountInfo = new AccountInfo('ACCOUNT-001')
  ): TransactionParty {
    return new TransactionParty(customerId, documentType, documentNumber, name, cellphone, accountInfo);
  }
}
