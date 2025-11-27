import { Inject, Injectable } from '@nestjs/common';
import { ThLogger, ThLoggerService } from 'themis';

import { TOKENS } from '~/shared/constants/tokens.constant';
import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { ICreateTransferUseCase, IGatewayClient, ITransferRepository } from '~/modules/transfer/application/ports';

@Injectable()
export class CreateTransferUseCase implements ICreateTransferUseCase {
  private readonly logger: ThLogger;

  constructor(
    @Inject(TOKENS.GATEWAY_CLIENT)
    private readonly gatewayClient: IGatewayClient,
    @Inject(TOKENS.TRANSFER_REPOSITORY)
    private readonly transferRepository: ITransferRepository,
    private readonly loggerService: ThLoggerService
  ) {
    this.logger = this.loggerService.getLogger(CreateTransferUseCase.name);
  }

  async execute(transfer: Transfer): Promise<Transfer> {
    this.logger.log(`Executing create transfer ${transfer.id} for transaction ${transfer.transactionId}`);

    const transferRes = await this.gatewayClient.createTransfer(transfer);
    const updatedTransfer = transfer.applyGatewayResult(transferRes);
    await this.transferRepository.save(updatedTransfer);
    return updatedTransfer;
  }
}
