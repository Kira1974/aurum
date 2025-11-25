import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  ENV: string;
  SERVICE: string;
  VERSION: string;
  MIN_LEVEL: string;
  LOGS_PROPERTIES: boolean;
  LOGS_COLORS: boolean;
}

const envsSchema = joi
  .object<EnvVars>({
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

const envVars: EnvVars = validationResult.value;

export const envs = {
  port: envVars.PORT,
  env: envVars.ENV,
  service: envVars.SERVICE,
  version: envVars.VERSION,
  minLevel: envVars.MIN_LEVEL,
  logsProperties: envVars.LOGS_PROPERTIES,
  logsColors: envVars.LOGS_COLORS
};
