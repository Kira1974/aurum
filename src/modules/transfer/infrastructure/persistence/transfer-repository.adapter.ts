import { ThLogger, ThLoggerService } from 'themis';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ITransferRepository } from '~/modules/transfer/application/ports';
import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';

import { TransferDocument } from './schemas/transfer.schema';

@Injectable()
export class MongoTransferRepository implements ITransferRepository {
  private readonly logger: ThLogger;

  constructor(
    @InjectModel(TransferDocument.name)
    private readonly transferModel: Model<TransferDocument>,
    loggerService: ThLoggerService
  ) {
    this.logger = loggerService.getLogger(MongoTransferRepository.name);
  }

  async save(transfer: Transfer): Promise<void> {
    this.logger.log(`Persisting transfer ${transfer.transactionId} in MongoDB`);
    const doc = new this.transferModel(this.toDocument(transfer));
    await doc.save();
  }

  private toDocument(transfer: Transfer): Partial<TransferDocument> {
    const payer = transfer.transactionParties.payer;
    const payee = transfer.transactionParties.payee;

    return {
      transactionId: transfer.transactionId,
      externalTransactionId: transfer.externalTransactionId || undefined,
      amount: {
        value: transfer.amount.value,
        currency: transfer.amount.currency
      },
      description: transfer.description,

      additionalData: transfer.additionalData,

      context: this.buildContext(transfer.context),

      transactionParties: {
        payer: payer ? this.buildPayerDocument(payer) : undefined,
        payee: this.buildPayeeDocument(payee)
      }
    };
  }

  private buildContext(context: Transfer['context']): TransferDocument['context'] {
    return {
      pointOfSale: context.pointOfSale,
      terminal: context.terminal,
      productCode: context.productCode,
      trace: context.trace
    };
  }

  private buildPayerDocument(
    payer: NonNullable<Transfer['transactionParties']['payer']>
  ): TransferDocument['transactionParties']['payer'] {
    return {
      customerId: payer.customerId,
      documentType: payer.documentType,
      documentNumber: payer.documentNumber,
      name: payer.name,
      cellphone: payer.cellphone,
      ...(payer.accountInfo && {
        accountInfo: {
          value: payer.accountInfo?.value
        }
      })
    };
  }

  private buildPayeeDocument(
    payee: Transfer['transactionParties']['payee']
  ): TransferDocument['transactionParties']['payee'] {
    return {
      customerId: payee.customerId,
      documentType: payee.documentType,
      documentNumber: payee.documentNumber,
      name: payee.name,
      cellphone: payee.cellphone,
      accountInfo: {
        value: payee.accountInfo!.value
      }
    };
  }
}
