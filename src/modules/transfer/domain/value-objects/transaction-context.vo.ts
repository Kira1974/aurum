import { InvalidTransferContextError } from '../errors';

export class TransactionContext {
  readonly pointOfSale: string;
  readonly terminal: string;
  readonly productCode: string;
  readonly trace: string;

  constructor(pointOfSale: string, terminal: string, productCode: string, trace: string) {
    this.pointOfSale = pointOfSale;
    this.terminal = terminal;
    this.productCode = productCode;
    this.trace = trace;
    this.validate();
  }

  private validate(): void {
    this.ensureNotBlank('pointOfSale', this.pointOfSale);
    this.ensureNotBlank('terminal', this.terminal);
    this.ensureNotBlank('productCode', this.productCode);
    this.ensureNotBlank('trace', this.trace);
  }

  private ensureNotBlank(field: string, value: string | null | undefined): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidTransferContextError(field, value ?? undefined);
    }
  }
}
