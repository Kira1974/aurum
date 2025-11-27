import { InfrastructureError } from '~/shared/errors/infrastructure-error.base';

class TestInfrastructureError extends InfrastructureError {
  readonly code = 'TEST_INFRA_ERROR';

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}

describe('InfrastructureError', () => {
  it('should create error with message', () => {
    const error = new TestInfrastructureError('Test error message');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InfrastructureError);
    expect(error.message).toBe('Test error message');
    expect(error.code).toBe('TEST_INFRA_ERROR');
    expect(error.name).toBe('TestInfrastructureError');
  });

  it('should create error with message and details', () => {
    const details = { provider: 'credibanco', url: 'http://example.com' };
    const error = new TestInfrastructureError('Test error message', details);

    expect(error.message).toBe('Test error message');
    expect(error.details).toStrictEqual(details);
  });

  it('should have stack trace', () => {
    const error = new TestInfrastructureError('Test error message');

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });
});
