import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { PayerResponseDto } from './payer-response.dto';
import { PayeeResponseDto } from './payee-response.dto';

export class TransactionPartiesResponseDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PayerResponseDto)
  payer: PayerResponseDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PayeeResponseDto)
  payee: PayeeResponseDto;
}
