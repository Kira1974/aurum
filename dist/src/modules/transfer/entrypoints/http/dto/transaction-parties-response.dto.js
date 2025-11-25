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
exports.TransactionPartiesResponseDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const payer_response_dto_1 = require("./payer-response.dto");
const payee_response_dto_1 = require("./payee-response.dto");
class TransactionPartiesResponseDto {
    payer;
    payee;
}
exports.TransactionPartiesResponseDto = TransactionPartiesResponseDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => payer_response_dto_1.PayerResponseDto),
    __metadata("design:type", payer_response_dto_1.PayerResponseDto)
], TransactionPartiesResponseDto.prototype, "payer", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => payee_response_dto_1.PayeeResponseDto),
    __metadata("design:type", payee_response_dto_1.PayeeResponseDto)
], TransactionPartiesResponseDto.prototype, "payee", void 0);
//# sourceMappingURL=transaction-parties-response.dto.js.map