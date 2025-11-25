"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionDataDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const transaction_dto_1 = require("./transaction.dto");
const transaction_parties_response_dto_1 = require("./transaction-parties-response.dto");
const merchant_response_dto_1 = require("./merchant-response.dto");
const notification_dto_1 = require("./notification.dto");
class TransactionDataDto {
    transaction;
    transactionParties;
    merchant;
    notification;
}
exports.TransactionDataDto = TransactionDataDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => transaction_dto_1.TransactionDto),
    __metadata("design:type", transaction_dto_1.TransactionDto)
], TransactionDataDto.prototype, "transaction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => transaction_parties_response_dto_1.TransactionPartiesResponseDto),
    __metadata("design:type", transaction_parties_response_dto_1.TransactionPartiesResponseDto)
], TransactionDataDto.prototype, "transactionParties", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => merchant_response_dto_1.MerchantResponseDto),
    __metadata("design:type", merchant_response_dto_1.MerchantResponseDto)
], TransactionDataDto.prototype, "merchant", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => notification_dto_1.NotificationDto),
    __metadata("design:type", notification_dto_1.NotificationDto)
], TransactionDataDto.prototype, "notification", void 0);
//# sourceMappingURL=transaction-data.dto.js.map