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
var TransferController_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferController = void 0;
const common_1 = require("@nestjs/common");
const themis_1 = require("themis");
const dto_1 = require("../dto");
const transfer_mapper_1 = require("../mappings/transfer.mapper");
const tokens_constant_1 = require("../../../../../shared/constants/tokens.constant");
let TransferController = TransferController_1 = class TransferController {
    createTransferUseCase;
    loggerService;
    logger;
    constructor(createTransferUseCase, loggerService) {
        this.createTransferUseCase = createTransferUseCase;
        this.loggerService = loggerService;
        this.logger = this.loggerService.getLogger(TransferController_1.name);
    }
    async createTransfer(dto) {
        this.logger.log(`Received createTransfer request with DTO: ${JSON.stringify(dto)}`);
        const createTransferResult = await this.createTransferUseCase.execute(transfer_mapper_1.TransferMapper.toEntity(dto));
        return transfer_mapper_1.TransferMapper.toCreateTransferResponseDto(createTransferResult);
    }
};
exports.TransferController = TransferController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTransferRequestDto]),
    __metadata("design:returntype", Promise)
], TransferController.prototype, "createTransfer", null);
exports.TransferController = TransferController = TransferController_1 = __decorate([
    (0, common_1.Controller)({ path: 'transfers', version: '1' }),
    __param(0, (0, common_1.Inject)(tokens_constant_1.TOKENS.CREATE_TRANSFER_USE_CASE)),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof themis_1.ThLoggerService !== "undefined" && themis_1.ThLoggerService) === "function" ? _a : Object])
], TransferController);
//# sourceMappingURL=transfer.controller.js.map