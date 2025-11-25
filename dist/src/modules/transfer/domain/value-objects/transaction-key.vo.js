"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionKey = void 0;
class TransactionKey {
    _type;
    _value;
    constructor(type, value) {
        this._type = type;
        this._value = value;
        this.validate();
    }
    validate() {
        if (!this._type || this._type.trim().length === 0) {
            throw new Error('TransactionKey: type must not be empty');
        }
        if (!this._value || this._value.trim().length === 0) {
            throw new Error('TransactionKey: value must not be empty');
        }
    }
    get type() {
        return this._type;
    }
    get value() {
        return this._value;
    }
    equals(other) {
        return this._type === other._type && this._value === other._value;
    }
}
exports.TransactionKey = TransactionKey;
//# sourceMappingURL=transaction-key.vo.js.map