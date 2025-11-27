import { ProviderUnavailableError } from '~/modules/transfer/infrastructure/providers/errors';
import { InfrastructureError } from '~/shared/errors/infrastructure-error.base';

describe('Provider Errors', () => {
  describe('ProviderUnavailableError', () => {
    it('should be instance of InfrastructureError', () => {
      const error = new ProviderUnavailableError('Credibanco');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(InfrastructureError);
    });

    it('should have correct code', () => {
      const error = new ProviderUnavailableError('Credibanco');
      expect(error.code).toBe('PROVIDER_UNAVAILABLE');
    });

    it('should include provider name in message', () => {
      const providerName = 'Credibanco';
      const error = new ProviderUnavailableError(providerName);
      expect(error.message).toContain(`Provider ${providerName} is currently unavailable`);
    });

    it('should include provider name in details', () => {
      const providerName = 'Credibanco';
      const error = new ProviderUnavailableError(providerName);
      expect(error.details).toStrictEqual({
        providerName,
        originalError: undefined
      });
    });

    it('should include original error message in details when provided', () => {
      const providerName = 'Credibanco';
      const originalError = new Error('Connection timeout');
      const error = new ProviderUnavailableError(providerName, originalError);
      expect(error.details).toStrictEqual({
        providerName,
        originalError: 'Connection timeout'
      });
    });
  });
});
