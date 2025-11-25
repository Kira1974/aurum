import { Module } from '@nestjs/common';
import { ThLogLevel, ThTracingModule } from 'themis';

import { TransferModule } from '~/modules/transfer/transfer.module';

import { envs } from './config/envs.config';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    HealthModule,
    TransferModule,
    ThTracingModule.registerLoggerAsync({
      inject: [],
      useFactory: () => ({
        environment: envs.env,
        service: envs.service,
        version: envs.version,
        minimumLevel: envs.minLevel as ThLogLevel,
        format: {
          pretty: envs.logsProperties,
          colors: envs.logsColors
        }
      })
    })
  ]
})
export class AppModule {}
