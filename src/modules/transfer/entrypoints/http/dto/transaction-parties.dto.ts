import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { PayerRequestDto, PayerResponseDto } from './payer.dto';
import { PayeeRequestDto, PayeeResponseDto } from './payee.dto';

export class TransactionPartiesRequestDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => PayerRequestDto)
  payer?: PayerRequestDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PayeeRequestDto)
  payee: PayeeRequestDto;
}

export class TransactionPartiesResponseDto {
  @Type(() => PayerResponseDto)
  payer?: PayerResponseDto;

  @Type(() => PayeeResponseDto)
  payee?: PayeeResponseDto;
}
