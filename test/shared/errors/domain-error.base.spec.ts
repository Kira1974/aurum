import { DomainError } from '~/shared/errors/domain-error.base';

class TestDomainError extends DomainError {
  readonly code = 'TEST_ERROR';

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}

describe('DomainError', () => {
  it('should create error with message', () => {
    const error = new TestDomainError('Test error message');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.message).toBe('Test error message');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.name).toBe('TestDomainError');
  });

  it('should create error with message and details', () => {
    const details = { field: 'amount', value: 0 };
    const error = new TestDomainError('Test error message', details);

    expect(error.message).toBe('Test error message');
    expect(error.details).toStrictEqual(details);
  });

  it('should have stack trace', () => {
    const error = new TestDomainError('Test error message');

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });
});
