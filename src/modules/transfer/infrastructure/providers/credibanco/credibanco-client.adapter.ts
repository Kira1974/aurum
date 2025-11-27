import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from 'axios';
import { ThLogger, ThLoggerService } from 'themis';

import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { IGatewayClient } from '~/modules/transfer/application/ports/providers/gateway-client.port';
import { TransferGatewayResult } from '~/modules/transfer/domain/types/transfer-gateway-result.type';
import { TransferStatus } from '~/modules/transfer/domain/constants/transfer-status.enum';

import { ProviderUnavailableError } from '../errors';

import { GatewayClientMapper } from './mappings/gateway-client.mapper';
import { GatewayClientResponse } from './mappings/gateway.type';

@Injectable()
export class CredibancoClientAdapter implements IGatewayClient {
  private readonly logger: ThLogger;
  private readonly baseUrl = 'http://localhost:8080/api/cred';
  private readonly REQUEST_TIMEOUT_MS = 30000;

  constructor(
    private readonly httpService: HttpService,
    private readonly loggerService: ThLoggerService
  ) {
    this.logger = this.loggerService.getLogger(CredibancoClientAdapter.name);
  }

  async createTransfer(transfer: Transfer): Promise<TransferGatewayResult> {
    this.logger.log(`Sending transfer request to Credibanco connector: ${transfer.id}`);

    //const request = GatewayClientMapper.toGatewayRequest(transfer);

    try {
      /*const response = await firstValueFrom(
        this.httpService.post<GatewayClientResponse>(this.baseUrl, request, {
          timeout: this.REQUEST_TIMEOUT_MS
        })
      );*/
      await new Promise((resolve) => setTimeout(resolve, 1000)); //TODO: OJO

      const response = {
        //TODO: OJO
        data: {
          transactionId: 'TX-0001',
          responseCode: TransferStatus.SUCCESS,
          message: 'Payment pending',
          externalTransactionId: '20251120135790864CRB001763694229136',
          additionalData: {
            END_TO_END: '20251120135790864CRB001763694229136',
            EXECUTION_ID: '202511200BANKCRB00029a85dc48b',
            DOCUMENT_NUMBER_KEY_RESOLUTION: '10185888888',
            OWNER_NAME_KEY_RESOLUTION: 'Pepito Perez',
            ACCOUNT_NUMBER_KEY_RESOLUTION: '9300-0000001'
          }
        }
      };

      this.logger.log(`Credibanco service response: ${JSON.stringify(response.data)}`);

      return GatewayClientMapper.toTransferGatewayResult(response.data);
    } catch (error: unknown) {
      this.handleProviderError(error);
    }
  }

  private handleProviderError(error: unknown): never {
    const { status, message, stack } = this.extractErrorInfo(error);

    this.logger.error(`Error calling Credibanco connector - Status: ${status}, Message: ${message}`, stack);

    throw new ProviderUnavailableError('Credibanco', error instanceof Error ? error : new Error(String(error)));
  }

  private extractErrorInfo(error: unknown): {
    status: string | number;
    message: string;
    stack?: string;
  } {
    if (isAxiosError(error)) {
      return {
        status: error.response?.status ?? 'N/A',
        message:
          (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? 'Unknown error',
        stack: error.stack
      };
    }

    if (error instanceof Error) {
      return {
        status: 'N/A',
        message: error.message,
        stack: error.stack
      };
    }

    return {
      status: 'N/A',
      message: 'Unknown error'
    };
  }
}
