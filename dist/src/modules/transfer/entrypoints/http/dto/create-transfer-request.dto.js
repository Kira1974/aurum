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
exports.CreateTransferRequestDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const context_dto_1 = require("./context.dto");
const transaction_request_dto_1 = require("./transaction-request.dto");
const transaction_parties_request_dto_1 = require("./transaction-parties-request.dto");
const additional_data_dto_1 = require("./additional-data.dto");
class CreateTransferRequestDto {
    context;
    transaction;
    transactionParties;
    additionalData;
}
exports.CreateTransferRequestDto = CreateTransferRequestDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => context_dto_1.ContextDto),
    __metadata("design:type", context_dto_1.ContextDto)
], CreateTransferRequestDto.prototype, "context", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => transaction_request_dto_1.TransactionRequestDto),
    __metadata("design:type", transaction_request_dto_1.TransactionRequestDto)
], CreateTransferRequestDto.prototype, "transaction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => transaction_parties_request_dto_1.TransactionPartiesRequestDto),
    __metadata("design:type", transaction_parties_request_dto_1.TransactionPartiesRequestDto)
], CreateTransferRequestDto.prototype, "transactionParties", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => additional_data_dto_1.AdditionalDataDto),
    __metadata("design:type", additional_data_dto_1.AdditionalDataDto)
], CreateTransferRequestDto.prototype, "additionalData", void 0);
//# sourceMappingURL=create-transfer-request.dto.js.map