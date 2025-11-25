export class ProviderDecision {
  private readonly _responseCode: string;
  private readonly _message: string;
  private readonly _additionalData?: Record<string, string>;

  constructor(responseCode: string, message: string, additionalData?: Record<string, string>) {
    this._responseCode = responseCode;
    this._message = message;
    this._additionalData = additionalData;
    this.validate();
  }

  private validate(): void {
    this.ensureNotBlank('responseCode', this._responseCode);
    this.ensureNotBlank('message', this._message);
  }

  private ensureNotBlank(field: string, value: string | null | undefined): void {
    if (!value || value.trim().length === 0) {
      throw new Error(`ProviderDecision: ${field} must not be empty`);
    }
  }

  get responseCode(): string {
    return this._responseCode;
  }

  get message(): string {
    return this._message;
  }

  get additionalData(): Record<string, string> | undefined {
    return this._additionalData ? { ...this._additionalData } : undefined;
  }

  isSuccess(): boolean {
    return this._responseCode === 'SUCCESS' || this._responseCode === 'TRANSACTION_PENDING';
  }

  isPending(): boolean {
    return this._responseCode === 'TRANSACTION_PENDING';
  }

  isError(): boolean {
    return !this.isSuccess() && !this.isPending();
  }

  equals(other: ProviderDecision): boolean {
    return (
      this._responseCode === other._responseCode &&
      this._message === other._message &&
      JSON.stringify(this._additionalData) === JSON.stringify(other._additionalData)
    );
  }
}
