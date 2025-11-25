import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { PayerRequestDto } from './payer-request.dto';
import { PayeeRequestDto } from './payee-request.dto';

export class TransactionPartiesRequestDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PayerRequestDto)
  payer: PayerRequestDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PayeeRequestDto)
  payee: PayeeRequestDto;
}
