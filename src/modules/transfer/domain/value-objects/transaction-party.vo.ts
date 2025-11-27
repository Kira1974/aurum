import { AccountInfo } from './account-info.vo';

export class TransactionParty {
  readonly customerId: string;
  readonly documentType: string;
  readonly documentNumber: string;
  readonly name: string;
  readonly cellphone: string;
  readonly accountInfo?: AccountInfo;

  constructor(
    customerId: string,
    documentType: string,
    documentNumber: string,
    name: string,
    cellphone: string,
    accountInfo?: AccountInfo
  ) {
    this.customerId = customerId;
    this.documentType = documentType;
    this.documentNumber = documentNumber;
    this.name = name;
    this.cellphone = cellphone;
    this.accountInfo = accountInfo;
  }
}
