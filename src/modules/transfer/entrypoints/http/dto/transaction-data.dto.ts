import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { TransactionDto } from './transaction.dto';
import { TransactionPartiesResponseDto } from './transaction-parties-response.dto';
import { MerchantResponseDto } from './merchant-response.dto';
import { NotificationDto } from './notification.dto';

export class TransactionDataDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TransactionDto)
  transaction: TransactionDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TransactionPartiesResponseDto)
  transactionParties: TransactionPartiesResponseDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MerchantResponseDto)
  merchant: MerchantResponseDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NotificationDto)
  notification: NotificationDto;
}
