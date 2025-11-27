import { ApplicationError } from '~/shared/errors/application-error.base';

class TestApplicationError extends ApplicationError {
  readonly code = 'TEST_APP_ERROR';

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}

describe('ApplicationError', () => {
  it('should create error with message', () => {
    const error = new TestApplicationError('Test error message');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApplicationError);
    expect(error.message).toBe('Test error message');
    expect(error.code).toBe('TEST_APP_ERROR');
    expect(error.name).toBe('TestApplicationError');
  });

  it('should create error with message and details', () => {
    const details = { service: 'gateway', status: 500 };
    const error = new TestApplicationError('Test error message', details);

    expect(error.message).toBe('Test error message');
    expect(error.details).toStrictEqual(details);
  });

  it('should have stack trace', () => {
    const error = new TestApplicationError('Test error message');

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });
});
