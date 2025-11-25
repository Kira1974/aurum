export declare class TransferContext {
    private readonly _pointOfSale;
    private readonly _terminal;
    private readonly _h2hPointOfSale;
    private readonly _transactionalPassword;
    private readonly _productCode;
    private readonly _trace;
    constructor(pointOfSale: string, terminal: string, h2hPointOfSale: string, transactionalPassword: string, productCode: string, trace: string);
    private validate;
    private ensureNotBlank;
    get pointOfSale(): string;
    get terminal(): string;
    get h2hPointOfSale(): string;
    get transactionalPassword(): string;
    get productCode(): string;
    get trace(): string;
    equals(other: TransferContext): boolean;
}
