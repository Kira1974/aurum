"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amount = void 0;
class Amount {
    _value;
    _currency;
    constructor(value, currency) {
        this._value = value;
        this._currency = currency;
        this.validate();
    }
    validate() {
        if (this._value <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        if (this._currency !== 'COP') {
            throw new Error(`Currency ${this._currency} not supported`);
        }
    }
    get value() {
        return this._value;
    }
    get currency() {
        return this._currency;
    }
    equals(other) {
        return this._value === other._value && this._currency === other._currency;
    }
}
exports.Amount = Amount;
//# sourceMappingURL=amount.vo.js.map