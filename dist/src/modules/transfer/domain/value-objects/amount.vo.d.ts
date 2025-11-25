export declare class Amount {
    private readonly _value;
    private readonly _currency;
    constructor(value: number, currency: string);
    private validate;
    get value(): number;
    get currency(): string;
    equals(other: Amount): boolean;
}
