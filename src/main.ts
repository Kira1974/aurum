import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ThLoggerService } from 'themis';

import { envs } from './config/envs.config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const loggerService = app.get(ThLoggerService);
  app.useGlobalFilters(new GlobalExceptionFilter(loggerService));

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  await app.listen(envs.port);
  logger.log(`Application is running on: localhost:${envs.port}`);
}
if (require.main === module) {
  void bootstrap();
}
