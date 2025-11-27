import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { AmountDto } from './amount.dto';

export class TransactionRequestDto {
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AmountDto)
  amount: AmountDto;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class TransactionResponseDto {
  transactionId: string;
  externalTransactionId?: string;
}
