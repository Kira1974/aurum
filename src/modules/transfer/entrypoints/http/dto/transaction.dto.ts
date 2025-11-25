import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { AmountDto } from './amount.dto';

export class TransactionDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AmountDto)
  amount: AmountDto;

  @IsNotEmpty()
  @IsString()
  description: string;
}
