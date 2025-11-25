"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
const joi = require("joi");
const envsSchema = joi
    .object({
    PORT: joi.number().required(),
    ENV: joi.string().default('dev'),
    SERVICE: joi.string().default('aurum'),
    VERSION: joi.string().default('1.0.0'),
    MIN_LEVEL: joi.string().default('INFO'),
    LOGS_PROPERTIES: joi.boolean().default(true),
    LOGS_COLORS: joi.boolean().default(true)
})
    .unknown(true);
const validationResult = envsSchema.validate(process.env);
if (validationResult.error) {
    throw new Error(`Config validation error: ${validationResult.error.message}`);
}
const envVars = validationResult.value;
exports.envs = {
    port: envVars.PORT,
    env: envVars.ENV,
    service: envVars.SERVICE,
    version: envVars.VERSION,
    minLevel: envVars.MIN_LEVEL,
    logsProperties: envVars.LOGS_PROPERTIES,
    logsColors: envVars.LOGS_COLORS
};
//# sourceMappingURL=envs.config.js.map