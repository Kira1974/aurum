"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const transaction_key_vo_1 = require("./transaction-key.vo");
class Transaction {
    _customerId;
    _documentType;
    _documentNumber;
    _key;
    constructor(customerId, documentType, documentNumber, key) {
        this._customerId = customerId;
        this._documentType = documentType;
        this._documentNumber = documentNumber;
        this._key = key;
        this.validate();
    }
    validate() {
        this.ensureNotBlank('customerId', this._customerId);
        this.ensureNotBlank('documentType', this._documentType);
        this.ensureNotBlank('documentNumber', this._documentNumber);
    }
    ensureNotBlank(field, value) {
        if (!value || value.trim().length === 0) {
            throw new Error(`Transaction: ${field} must not be empty`);
        }
    }
    get customerId() {
        return this._customerId;
    }
    get documentType() {
        return this._documentType;
    }
    get documentNumber() {
        return this._documentNumber;
    }
    get key() {
        return this._key;
    }
    equals(other) {
        return (this._customerId === other._customerId &&
            this._documentType === other._documentType &&
            this._documentNumber === other._documentNumber &&
            (this._key?.equals(other._key || new transaction_key_vo_1.TransactionKey('', '')) ?? !other._key));
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.vo.js.map