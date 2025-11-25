"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
const node_crypto_1 = require("node:crypto");
const value_objects_1 = require("../value-objects");
const additional_data_key_enum_1 = require("../constants/additional-data-key.enum");
class Transfer {
    _id;
    _amount;
    _description;
    _additionalData;
    _context;
    _transactionParties;
    _transactionId;
    constructor(props) {
        this._id = props.id || (0, node_crypto_1.randomUUID)();
        this._amount = props.amount;
        this._description = props.description;
        this._additionalData = props.additionalData;
        this._context = props.context;
        this._transactionParties = props.transactionParties;
        this._transactionId = props.transactionId;
    }
    static create(params) {
        return new Transfer(params);
    }
    get id() {
        return this._id;
    }
    get amount() {
        return this._amount;
    }
    get description() {
        return this._description;
    }
    get additionalData() {
        return this._additionalData;
    }
    get context() {
        return this._context;
    }
    get transactionParties() {
        return this._transactionParties;
    }
    get transactionId() {
        return this._transactionId;
    }
    applyProviderDecision(providerDecision) {
        const responseCode = 'TRANSACTION_PENDING';
        const responseMessage = providerDecision.message || 'Transaction pending confirmation';
        const currentData = this._additionalData?.toObject() || {};
        const updatedAdditionalData = new value_objects_1.AdditionalData({
            ...currentData,
            [additional_data_key_enum_1.AdditionalDataKey.RESPONSE_CODE]: responseCode,
            [additional_data_key_enum_1.AdditionalDataKey.RESPONSE_MESSAGE]: responseMessage
        });
        return Transfer.create({
            id: this._id,
            amount: this._amount,
            description: this._description,
            additionalData: updatedAdditionalData,
            context: this._context,
            transactionParties: this._transactionParties,
            transactionId: this._transactionId
        });
    }
}
exports.Transfer = Transfer;
//# sourceMappingURL=transfer.entity.js.map