import { HttpService } from '@nestjs/axios';
import { ThLoggerService } from 'themis';
import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { IGatewayClient } from '~/modules/transfer/application/ports/providers/gateway-client.port';
import { ProviderDecision } from '~/modules/transfer/domain/value-objects';
export declare class CredibancoClientAdapter implements IGatewayClient {
    private readonly httpService;
    private readonly loggerService;
    private readonly logger;
    private readonly baseUrl;
    constructor(httpService: HttpService, loggerService: ThLoggerService);
    createTransfer(transfer: Transfer): Promise<ProviderDecision>;
}
