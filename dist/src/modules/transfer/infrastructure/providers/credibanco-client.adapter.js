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
var CredibancoClientAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredibancoClientAdapter = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const themis_1 = require("themis");
const gateway_client_mapper_1 = require("./mappings/gateway-client.mapper");
let CredibancoClientAdapter = CredibancoClientAdapter_1 = class CredibancoClientAdapter {
    httpService;
    loggerService;
    logger;
    baseUrl = 'http://localhost:8080/api/cred';
    constructor(httpService, loggerService) {
        this.httpService = httpService;
        this.loggerService = loggerService;
        this.logger = this.loggerService.getLogger(CredibancoClientAdapter_1.name);
    }
    async createTransfer(transfer) {
        this.logger.log(`Sending transfer to credibanco connector: ${transfer.id}`);
        const request = gateway_client_mapper_1.GatewayClientMapper.toGatewayRequest(transfer);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.baseUrl, request));
            this.logger.log(`Credibanco service response: ${JSON.stringify(response.data)}`);
            const providerDecision = gateway_client_mapper_1.GatewayClientMapper.toProviderDecision(response.data);
            return providerDecision;
        }
        catch (error) {
            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'Unknown error';
            const errorStatus = error?.response?.status || 'N/A';
            const errorStack = error?.stack;
            this.logger.error(`Error calling credibanco connector - Status: ${errorStatus}, Message: ${errorMessage}`, errorStack);
            throw error;
        }
    }
};
exports.CredibancoClientAdapter = CredibancoClientAdapter;
exports.CredibancoClientAdapter = CredibancoClientAdapter = CredibancoClientAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        themis_1.ThLoggerService])
], CredibancoClientAdapter);
//# sourceMappingURL=credibanco-client.adapter.js.map