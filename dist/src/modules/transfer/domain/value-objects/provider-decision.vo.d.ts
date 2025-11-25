export declare class ProviderDecision {
    private readonly _responseCode;
    private readonly _message;
    private readonly _additionalData?;
    constructor(responseCode: string, message: string, additionalData?: Record<string, string>);
    private validate;
    private ensureNotBlank;
    get responseCode(): string;
    get message(): string;
    get additionalData(): Record<string, string> | undefined;
    isSuccess(): boolean;
    isPending(): boolean;
    isError(): boolean;
    equals(other: ProviderDecision): boolean;
}
