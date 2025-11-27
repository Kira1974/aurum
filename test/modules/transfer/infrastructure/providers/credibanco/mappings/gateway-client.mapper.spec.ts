import { GatewayClientMapper } from '~/modules/transfer/infrastructure/providers/credibanco/mappings/gateway-client.mapper';
import {
  GatewayClientRequest,
  GatewayClientResponse
} from '~/modules/transfer/infrastructure/providers/credibanco/mappings/gateway.type';
import { TransferGatewayResult } from '~/modules/transfer/domain/types/transfer-gateway-result.type';
import { TransferStatus } from '~/modules/transfer/domain/constants/transfer-status.enum';

import { TransferFactory, AmountFactory } from '../../../../../../factories';

describe('GatewayClientMapper', () => {
  describe('toGatewayRequest', () => {
    it('should map Transfer to GatewayClientRequest', () => {
      // Arrange
      const transfer = TransferFactory.create({
        transactionId: 'TRX-001',
        amount: AmountFactory.create(100.0, 'COP'),
        description: 'Test transfer',
        additionalData: { KEY1: 'value1', KEY2: 'value2' }
      });

      // Act
      const result = GatewayClientMapper.toGatewayRequest(transfer);

      // Assert
      expect(result).toStrictEqual<GatewayClientRequest>({
        transactionId: 'TRX-001',
        transaction: {
          amount: {
            value: 100.0,
            currency: 'COP'
          },
          description: 'Test transfer'
        },
        transactionParties: {
          payer: {
            customerId: 'CUST-001',
            documentType: 'CC',
            documentNumber: '1234567890'
          },
          payee: {
            customerId: 'CUST-002',
            documentType: 'CC',
            documentNumber: '0987654321',
            accountInfo: {
              value: 'ACCOUNT-001'
            }
          }
        },
        additionalData: {
          KEY1: 'value1',
          KEY2: 'value2'
        }
      });
    });
  });

  describe('toTransferGatewayResult', () => {
    it('should map GatewayClientResponse to TransferGatewayResult correctly', () => {
      // Arrange
      const response: GatewayClientResponse = {
        transactionId: 'TX-001',
        externalTransactionId: 'EXT-001',
        responseCode: TransferStatus.SUCCESS,
        message: 'Transaction completed',
        additionalData: {
          KEY1: 'value1',
          KEY2: 'value2'
        }
      };

      // Act
      const result = GatewayClientMapper.toTransferGatewayResult(response);

      // Assert
      expect(result).toStrictEqual<TransferGatewayResult>({
        transactionId: 'TX-001',
        externalTransactionId: 'EXT-001',
        responseCode: TransferStatus.SUCCESS,
        message: 'Transaction completed',
        additionalData: {
          KEY1: 'value1',
          KEY2: 'value2'
        }
      });
    });
  });
});
