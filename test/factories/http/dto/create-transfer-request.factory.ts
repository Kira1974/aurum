import { CreateTransferRequestDto } from '~/modules/transfer/entrypoints/http/dto/create-transfer-request.dto';
import { AdditionalDataKey } from '~/modules/transfer/domain/constants/additional-data-key.enum';

export class CreateTransferRequestFactory {
  static create(overrides?: Partial<CreateTransferRequestDto>): CreateTransferRequestDto {
    return {
      transaction: {
        transactionId: 'TX-001',
        amount: {
          value: 1000,
          currency: 'COP'
        },
        description: 'Test transfer',
        ...overrides?.transaction
      },
      context: {
        pointOfSale: 'POS-123',
        terminal: 'TERM-001',
        h2hPointOfSale: 'H2H-77',
        transactionalPassword: 'password123',
        productCode: 'C79',
        trace: '3108de04',
        ...overrides?.context
      },
      transactionParties: {
        payer: {
          customerId: 'CUST-001',
          documentType: 'CC',
          documentNumber: '1234567890',
          name: 'Payer Name',
          cellphone: '3001234567',
          ...overrides?.transactionParties?.payer
        },
        payee: {
          customerId: 'CUST-002',
          documentType: 'CC',
          documentNumber: '0987654321',
          name: 'Payee Name',
          cellphone: '3001234567',
          accountInfo: {
            value: 'ACCOUNT-001'
          },
          ...overrides?.transactionParties?.payee
        },
        ...overrides?.transactionParties
      },
      additionalData: overrides?.additionalData,
      ...overrides
    } as CreateTransferRequestDto;
  }

  static createWithAdditionalData(
    additionalData: Partial<Record<AdditionalDataKey, string>>
  ): CreateTransferRequestDto {
    return this.create({ additionalData });
  }

  static createWithoutAccountInfo(): CreateTransferRequestDto {
    const dto = this.create();
    delete (dto.transactionParties.payee as any).accountInfo;
    return dto;
  }
}
