import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { TOKENS } from '~/shared/constants/tokens.constant';

import { CreateTransferUseCase } from './application/use-cases/create-transfer.use-case';
import { CredibancoClientAdapter } from './infrastructure/providers/credibanco/credibanco-client.adapter';
import { TransferController } from './entrypoints/http/controllers/transfer.controller';
import { TransferExceptionFilter } from './entrypoints/http/filters/transfer-exception.filter';
import { MongoTransferRepository } from './infrastructure/persistence/transfer-repository.adapter';
import { TransferDocument, TransferSchema } from './infrastructure/persistence/schemas/transfer.schema';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    MongooseModule.forFeature([{ name: TransferDocument.name, schema: TransferSchema }])
  ],
  controllers: [TransferController],
  providers: [
    {
      provide: TOKENS.CREATE_TRANSFER_USE_CASE,
      useClass: CreateTransferUseCase
    },
    {
      provide: TOKENS.GATEWAY_CLIENT,
      useClass: CredibancoClientAdapter
    },
    {
      provide: TOKENS.TRANSFER_REPOSITORY,
      useClass: MongoTransferRepository
    },
    TransferExceptionFilter
  ],
  exports: []
})
export class TransferModule {}
