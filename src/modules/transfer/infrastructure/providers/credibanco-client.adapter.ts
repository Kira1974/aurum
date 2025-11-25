import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ThLogger, ThLoggerService } from 'themis';

import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { IGatewayClient } from '~/modules/transfer/application/ports/providers/gateway-client.port';
import { ProviderDecision } from '~/modules/transfer/domain/value-objects';

import { GatewayClientMapper, CredClientResponse } from './mappings/gateway-client.mapper';

@Injectable()
export class CredibancoClientAdapter implements IGatewayClient {
  private readonly logger: ThLogger;
  private readonly baseUrl = 'http://localhost:8080/api/cred';

  constructor(
    private readonly httpService: HttpService,
    private readonly loggerService: ThLoggerService
  ) {
    this.logger = this.loggerService.getLogger(CredibancoClientAdapter.name);
  }

  async createTransfer(transfer: Transfer): Promise<ProviderDecision> {
    this.logger.log(`Sending transfer to credibanco connector: ${transfer.id}`);

    const request = GatewayClientMapper.toGatewayRequest(transfer);

    try {
      const response = await firstValueFrom(this.httpService.post<CredClientResponse>(this.baseUrl, request));

      this.logger.log(`Credibanco service response: ${JSON.stringify(response.data)}`);

      const providerDecision = GatewayClientMapper.toProviderDecision(response.data);

      return providerDecision;
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Unknown error';
      const errorStatus = (error as { response?: { status?: number } })?.response?.status || 'N/A';
      const errorStack = (error as { stack?: string })?.stack;
      this.logger.error(
        `Error calling credibanco connector - Status: ${errorStatus}, Message: ${errorMessage}`,
        errorStack
      );
      throw error;
    }
  }
}
