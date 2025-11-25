"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferMapper = void 0;
const transfer_entity_1 = require("../../../domain/entities/transfer.entity");
const value_objects_1 = require("../../../domain/value-objects");
const additional_data_key_enum_1 = require("../../../domain/constants/additional-data-key.enum");
class TransferMapper {
    static toEntity(dto) {
        const additionalData = this.toAdditionalData(dto.additionalData);
        const sender = this.toTransaction(dto.transactionParties.payer);
        const recipient = this.toTransaction(dto.transactionParties.payee, dto.transactionParties.payee.key);
        const transactionParties = new value_objects_1.TransactionParties(sender, recipient);
        const props = {
            amount: this.toAmount(dto.transaction.amount),
            description: dto.transaction.description,
            additionalData,
            context: this.toTransferContext(dto.context),
            transactionParties,
            transactionId: dto.transaction.transactionId
        };
        return transfer_entity_1.Transfer.create(props);
    }
    static toCreateTransferResponseDto(transfer, payerCustomerId, payeeCustomerId, merchantCustomerId, notificationChannel, notificationCellphone, notificationMessage) {
        const responseCode = transfer.additionalData?.get(additional_data_key_enum_1.AdditionalDataKey.RESPONSE_CODE) || 'TRANSACTION_PENDING';
        const message = transfer.additionalData?.get(additional_data_key_enum_1.AdditionalDataKey.RESPONSE_MESSAGE) || 'Transfer pending for provider';
        const transaction = this.toTransactionDto(transfer);
        const transactionParties = this.toTransactionPartiesResponseDto(transfer, payerCustomerId, payeeCustomerId);
        const merchant = this.toMerchantResponseDto(merchantCustomerId);
        const notification = this.toNotificationDto(transfer, notificationChannel, notificationCellphone, notificationMessage);
        const data = {
            transaction,
            transactionParties,
            merchant,
            notification
        };
        return {
            transactionId: transfer.transactionId,
            responseCode,
            message,
            data
        };
    }
    static toTransactionDto(transfer) {
        return {
            amount: {
                value: transfer.amount.value,
                currency: transfer.amount.currency
            },
            description: transfer.description
        };
    }
    static toTransactionPartiesResponseDto(transfer, payerCustomerId, payeeCustomerId) {
        return {
            payer: {
                customerId: payerCustomerId || transfer.transactionParties.sender.customerId
            },
            payee: {
                customerId: payeeCustomerId || transfer.transactionParties.recipient.customerId
            }
        };
    }
    static toMerchantResponseDto(merchantCustomerId) {
        return {
            customerId: merchantCustomerId || 'CUST-003'
        };
    }
    static toNotificationDto(transfer, notificationChannel, notificationCellphone, notificationMessage) {
        const recipientKey = transfer.transactionParties.recipient.key;
        const cellphone = recipientKey?.type === 'PHONE'
            ? recipientKey.value
            : transfer.additionalData?.get(additional_data_key_enum_1.AdditionalDataKey.CELLPHONE) || '3001234567';
        return {
            channel: notificationChannel || 'SMS',
            cellphone: notificationCellphone || cellphone,
            message: notificationMessage ||
                `Tu pago de $${transfer.amount.value} ${transfer.amount.currency} esta pendiente de confirmacion.`
        };
    }
    static toAmount(amountDto) {
        return new value_objects_1.Amount(amountDto.value, amountDto.currency);
    }
    static toAdditionalData(additionalDataDto) {
        if (!additionalDataDto) {
            return undefined;
        }
        const additionalDataMap = {};
        if (additionalDataDto[additional_data_key_enum_1.AdditionalDataKey.KEY]) {
            additionalDataMap[additional_data_key_enum_1.AdditionalDataKey.KEY] = additionalDataDto[additional_data_key_enum_1.AdditionalDataKey.KEY];
        }
        if (additionalDataDto[additional_data_key_enum_1.AdditionalDataKey.CELLPHONE]) {
            additionalDataMap[additional_data_key_enum_1.AdditionalDataKey.CELLPHONE] = additionalDataDto[additional_data_key_enum_1.AdditionalDataKey.CELLPHONE];
        }
        if (additionalDataDto[additional_data_key_enum_1.AdditionalDataKey.COMPANY_NAME]) {
            additionalDataMap[additional_data_key_enum_1.AdditionalDataKey.COMPANY_NAME] = additionalDataDto[additional_data_key_enum_1.AdditionalDataKey.COMPANY_NAME];
        }
        return Object.keys(additionalDataMap).length > 0 ? new value_objects_1.AdditionalData(additionalDataMap) : undefined;
    }
    static toTransferContext(contextDto) {
        return new value_objects_1.TransferContext(contextDto.pointOfSale, contextDto.terminal, contextDto.h2hPointOfSale, contextDto.transactionalPassword, contextDto.productCode, contextDto.trace);
    }
    static toTransaction(party, key) {
        const transactionKey = key ? new value_objects_1.TransactionKey(key.type, key.value) : undefined;
        return new value_objects_1.Transaction(party.customerId, party.documentType, party.documentNumber, transactionKey);
    }
}
exports.TransferMapper = TransferMapper;
//# sourceMappingURL=transfer.mapper.js.map