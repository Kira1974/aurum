import { Module } from '@nestjs/common';
import { ThLogLevel, ThTracingModule } from 'themis';
import { MongooseModule } from '@nestjs/mongoose';

import { TransferModule } from '~/modules/transfer/transfer.module';

import { envs } from './config/envs.config';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongoQueryConnection, {
      dbName: 'transactions' // TODO
    }),
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
