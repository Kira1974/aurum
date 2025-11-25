"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionParties = void 0;
class TransactionParties {
    _sender;
    _recipient;
    constructor(sender, recipient) {
        this._sender = sender;
        this._recipient = recipient;
        this.validate();
    }
    validate() {
        if (!this._sender) {
            throw new Error('TransactionParties: sender must not be null');
        }
        if (!this._recipient) {
            throw new Error('TransactionParties: recipient must not be null');
        }
    }
    get sender() {
        return this._sender;
    }
    get recipient() {
        return this._recipient;
    }
    equals(other) {
        return this._sender.equals(other._sender) && this._recipient.equals(other._recipient);
    }
}
exports.TransactionParties = TransactionParties;
//# sourceMappingURL=transaction-parties.vo.js.map