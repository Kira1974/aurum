import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { TOKENS } from '~/shared/constants/tokens.constant';

import { CreateTransferUseCase } from './application/use-cases/create-transfer.use-case';
import { CredibancoClientAdapter } from './infrastructure/providers/credibanco-client.adapter';
import { KafkaConsumerAdapter } from './infrastructure/events/kafka-consumer.adapter';
import { TransferController } from './entrypoints/http/controllers/transfer.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  controllers: [TransferController],

  providers: [
    { provide: TOKENS.CREATE_TRANSFER_USE_CASE, useClass: CreateTransferUseCase },
    { provide: TOKENS.GATEWAY_CLIENT, useClass: CredibancoClientAdapter },
    { provide: TOKENS.EVENTS_CONSUMER, useClass: KafkaConsumerAdapter }
  ],
  exports: []
})
export class TransferModule {}
