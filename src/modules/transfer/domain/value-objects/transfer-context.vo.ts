export class TransferContext {
  private readonly _pointOfSale: string;
  private readonly _terminal: string;
  private readonly _h2hPointOfSale: string;
  private readonly _transactionalPassword: string;
  private readonly _productCode: string;
  private readonly _trace: string;

  public constructor(
    pointOfSale: string,
    terminal: string,
    h2hPointOfSale: string,
    transactionalPassword: string,
    productCode: string,
    trace: string
  ) {
    this._pointOfSale = pointOfSale;
    this._terminal = terminal;
    this._h2hPointOfSale = h2hPointOfSale;
    this._transactionalPassword = transactionalPassword;
    this._productCode = productCode;
    this._trace = trace;
    this.validate();
  }

  private validate(): void {
    this.ensureNotBlank('pointOfSale', this._pointOfSale);
    this.ensureNotBlank('terminal', this._terminal);
    this.ensureNotBlank('h2hPointOfSale', this._h2hPointOfSale);
    this.ensureNotBlank('transactionalPassword', this._transactionalPassword);
    this.ensureNotBlank('productCode', this._productCode);
    this.ensureNotBlank('trace', this._trace);
  }

  private ensureNotBlank(field: string, value: string | null | undefined): void {
    if (!value || value.trim().length === 0) {
      throw new Error(`TransferContext: ${field} must not be empty`);
    }
  }

  get pointOfSale(): string {
    return this._pointOfSale;
  }

  get terminal(): string {
    return this._terminal;
  }

  get h2hPointOfSale(): string {
    return this._h2hPointOfSale;
  }

  get transactionalPassword(): string {
    return this._transactionalPassword;
  }

  get productCode(): string {
    return this._productCode;
  }

  get trace(): string {
    return this._trace;
  }

  equals(other: TransferContext): boolean {
    return (
      this._pointOfSale === other._pointOfSale &&
      this._terminal === other._terminal &&
      this._h2hPointOfSale === other._h2hPointOfSale &&
      this._transactionalPassword === other._transactionalPassword &&
      this._productCode === other._productCode &&
      this._trace === other._trace
    );
  }
}
