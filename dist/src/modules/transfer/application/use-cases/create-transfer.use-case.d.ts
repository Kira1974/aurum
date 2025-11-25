import { ThLoggerService } from 'themis';
import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { ICreateTransferUseCase, IGatewayClient } from '~/modules/transfer/application/ports';
export declare class CreateTransferUseCase implements ICreateTransferUseCase {
    private readonly gatewayClient;
    private readonly loggerService;
    private readonly logger;
    constructor(gatewayClient: IGatewayClient, loggerService: ThLoggerService);
    execute(transfer: Transfer): Promise<Transfer>;
}
