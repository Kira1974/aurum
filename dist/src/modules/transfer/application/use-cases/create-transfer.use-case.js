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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CreateTransferUseCase_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransferUseCase = void 0;
const common_1 = require("@nestjs/common");
const themis_1 = require("themis");
const tokens_constant_1 = require("../../../../shared/constants/tokens.constant");
let CreateTransferUseCase = CreateTransferUseCase_1 = class CreateTransferUseCase {
    gatewayClient;
    loggerService;
    logger;
    constructor(gatewayClient, loggerService) {
        this.gatewayClient = gatewayClient;
        this.loggerService = loggerService;
        this.logger = this.loggerService.getLogger(CreateTransferUseCase_1.name);
    }
    async execute(transfer) {
        this.logger.log(`Executing create transfer ${transfer.id} for transaction ${transfer.transactionId}`);
        const providerDecision = await this.gatewayClient.createTransfer(transfer);
        const transferWithStatus = transfer.applyProviderDecision(providerDecision);
        return transferWithStatus;
    }
};
exports.CreateTransferUseCase = CreateTransferUseCase;
exports.CreateTransferUseCase = CreateTransferUseCase = CreateTransferUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tokens_constant_1.TOKENS.GATEWAY_CLIENT)),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof themis_1.ThLoggerService !== "undefined" && themis_1.ThLoggerService) === "function" ? _a : Object])
], CreateTransferUseCase);
//# sourceMappingURL=create-transfer.use-case.js.map