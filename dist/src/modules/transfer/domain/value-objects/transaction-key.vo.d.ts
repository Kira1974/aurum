export declare class TransactionKey {
    private readonly _type;
    private readonly _value;
    constructor(type: string, value: string);
    private validate;
    get type(): string;
    get value(): string;
    equals(other: TransactionKey): boolean;
}
