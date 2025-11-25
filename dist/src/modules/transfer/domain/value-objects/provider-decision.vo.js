"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderDecision = void 0;
class ProviderDecision {
    _responseCode;
    _message;
    _additionalData;
    constructor(responseCode, message, additionalData) {
        this._responseCode = responseCode;
        this._message = message;
        this._additionalData = additionalData;
        this.validate();
    }
    validate() {
        this.ensureNotBlank('responseCode', this._responseCode);
        this.ensureNotBlank('message', this._message);
    }
    ensureNotBlank(field, value) {
        if (!value || value.trim().length === 0) {
            throw new Error(`ProviderDecision: ${field} must not be empty`);
        }
    }
    get responseCode() {
        return this._responseCode;
    }
    get message() {
        return this._message;
    }
    get additionalData() {
        return this._additionalData ? { ...this._additionalData } : undefined;
    }
    isSuccess() {
        return this._responseCode === 'SUCCESS' || this._responseCode === 'TRANSACTION_PENDING';
    }
    isPending() {
        return this._responseCode === 'TRANSACTION_PENDING';
    }
    isError() {
        return !this.isSuccess() && !this.isPending();
    }
    equals(other) {
        return (this._responseCode === other._responseCode &&
            this._message === other._message &&
            JSON.stringify(this._additionalData) === JSON.stringify(other._additionalData));
    }
}
exports.ProviderDecision = ProviderDecision;
//# sourceMappingURL=provider-decision.vo.js.map