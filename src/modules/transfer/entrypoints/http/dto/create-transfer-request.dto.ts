import { IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { ContextDto } from './context.dto';
import { TransactionRequestDto } from './transaction.dto';
import { TransactionPartiesRequestDto } from './transaction-parties.dto';

export class CreateTransferRequestDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ContextDto)
  context: ContextDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TransactionRequestDto)
  transaction: TransactionRequestDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TransactionPartiesRequestDto)
  transactionParties: TransactionPartiesRequestDto;

  @IsOptional()
  @ValidateNested()
  additionalData?: Record<string, string>;
}
