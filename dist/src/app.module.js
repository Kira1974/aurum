"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const themis_1 = require("themis");
const transfer_module_1 = require("./modules/transfer/transfer.module");
const envs_config_1 = require("./config/envs.config");
const health_module_1 = require("./modules/health/health.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            health_module_1.HealthModule,
            transfer_module_1.TransferModule,
            themis_1.ThTracingModule.registerLoggerAsync({
                inject: [],
                useFactory: () => ({
                    environment: envs_config_1.envs.env,
                    service: envs_config_1.envs.service,
                    version: envs_config_1.envs.version,
                    minimumLevel: envs_config_1.envs.minLevel,
                    format: {
                        pretty: envs_config_1.envs.logsProperties,
                        colors: envs_config_1.envs.logsColors
                    }
                })
            })
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map