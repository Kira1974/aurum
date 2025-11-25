import { AdditionalDataKey } from '../constants/additional-data-key.enum';
export declare class AdditionalData {
    private readonly _data;
    constructor(data: Partial<Record<AdditionalDataKey, string>>);
    private validate;
    get(key: AdditionalDataKey): string | undefined;
    toObject(): Partial<Record<AdditionalDataKey, string>>;
    has(key: AdditionalDataKey): boolean;
    keys(): AdditionalDataKey[];
    add(key: AdditionalDataKey, value: string): AdditionalData;
    addAll(data: Partial<Record<AdditionalDataKey, string>>): AdditionalData;
    equals(other: AdditionalData): boolean;
    static empty(): AdditionalData;
}
