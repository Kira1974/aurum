import { InfrastructureError } from '~/shared/errors/infrastructure-error.base';

export class ProviderUnavailableError extends InfrastructureError {
  readonly code = 'PROVIDER_UNAVAILABLE';

  constructor(providerName: string, originalError?: Error) {
    super(`Provider ${providerName} is currently unavailable`, {
      providerName,
      originalError: originalError?.message
    });
  }
}
