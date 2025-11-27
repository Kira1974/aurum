import { Type } from 'class-transformer';

import { TransactionResponseDto } from './transaction.dto';
import { NotificationDto } from './notification.dto';

export class TransactionDataDto {
  @Type(() => TransactionResponseDto)
  transaction: TransactionResponseDto;

  @Type(() => NotificationDto)
  notification?: NotificationDto[];

  additionalData?: Record<string, string>;
}

export class CreateTransferResponseDto {
  responseCode: string;

  message: string;

  @Type(() => TransactionDataDto)
  data?: TransactionDataDto;
}
