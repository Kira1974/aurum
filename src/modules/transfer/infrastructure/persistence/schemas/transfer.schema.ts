import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'transfers',
  timestamps: true
})
export class TransferDocument extends Document {
  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  externalTransactionId: string;

  @Prop({ required: true })
  description: string;

  // @Prop({ required: true })
  @Prop() //TODO required true
  responseCode?: string;

  @Prop({ type: Object, required: true })
  context: {
    pointOfSale: string;
    terminal: string;
    productCode: string;
    trace: string;
  };

  @Prop({ type: Object, required: true })
  amount: {
    value: number;
    currency: string;
  };

  @Prop({
    //TODO
    type: {
      payer: {
        customerId: { type: String, required: false },
        documentType: { type: String, required: false },
        documentNumber: { type: String, required: false },
        name: { type: String, required: false },
        cellphone: { type: String, required: false },
        accountInfo: {
          value: { type: String, required: false }
        }
      },
      payee: {
        customerId: { type: String, required: false }, //TODO required true
        documentType: { type: String, required: false },
        documentNumber: { type: String, required: false },
        name: { type: String, required: false },
        cellphone: { type: String, required: false },
        accountInfo: {
          value: { type: String, required: false } //TODO required true
        }
      }
    },
    required: true
  })
  transactionParties: {
    payer?: {
      customerId?: string;
      documentType?: string;
      documentNumber?: string;
      name?: string;
      cellphone?: string;
      accountInfo?: { value: string };
    };
    payee: {
      customerId: string;
      documentType: string;
      documentNumber: string;
      name?: string;
      cellphone?: string;
      accountInfo: { value: string };
    };
  };

  @Prop({ type: Object })
  merchant?: {
    customerId: string;
    companyName?: string;
  };

  @Prop({ type: Object })
  additionalData?: Record<string, string>;

  @Prop({ type: Object })
  notification?: unknown;

  @Prop({ type: Object })
  providerRawResponse?: unknown; // TODO
}

export const TransferSchema = SchemaFactory.createForClass(TransferDocument);
