"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayClientMapper = void 0;
const value_objects_1 = require("../../../domain/value-objects");
class GatewayClientMapper {
    static toGatewayRequest(transfer) {
        return {
            amount: {
                value: transfer.amount.value,
                currency: transfer.amount.currency
            },
            description: transfer.description,
            additionalData: transfer.additionalData?.toObject() || {},
            transactionId: transfer.transactionId
        };
    }
    static toProviderDecision(credResponse) {
        return new value_objects_1.ProviderDecision(credResponse.responseCode, credResponse.message, credResponse.additionalData);
    }
}
exports.GatewayClientMapper = GatewayClientMapper;
//# sourceMappingURL=gateway-client.mapper.js.map