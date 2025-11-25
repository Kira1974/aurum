"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const tokens_constant_1 = require("../../shared/constants/tokens.constant");
const create_transfer_use_case_1 = require("./application/use-cases/create-transfer.use-case");
const credibanco_client_adapter_1 = require("./infrastructure/providers/credibanco-client.adapter");
const kafka_consumer_adapter_1 = require("./infrastructure/events/kafka-consumer.adapter");
const transfer_controller_1 = require("./entrypoints/http/controllers/transfer.controller");
let TransferModule = class TransferModule {
};
exports.TransferModule = TransferModule;
exports.TransferModule = TransferModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 5
            })
        ],
        controllers: [transfer_controller_1.TransferController],
        providers: [
            { provide: tokens_constant_1.TOKENS.CREATE_TRANSFER_USE_CASE, useClass: create_transfer_use_case_1.CreateTransferUseCase },
            { provide: tokens_constant_1.TOKENS.GATEWAY_CLIENT, useClass: credibanco_client_adapter_1.CredibancoClientAdapter },
            { provide: tokens_constant_1.TOKENS.EVENTS_CONSUMER, useClass: kafka_consumer_adapter_1.KafkaConsumerAdapter }
        ],
        exports: []
    })
], TransferModule);
//# sourceMappingURL=transfer.module.js.map