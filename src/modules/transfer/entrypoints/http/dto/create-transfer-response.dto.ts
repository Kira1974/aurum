import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { TransactionDataDto } from './transaction-data.dto';

export class CreateTransferResponseDto {
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsNotEmpty()
  @IsString()
  responseCode: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TransactionDataDto)
  data: TransactionDataDto;
}
