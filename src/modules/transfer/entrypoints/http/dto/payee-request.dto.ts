import { IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { KeyDto } from './key.dto';

export class PayeeRequestDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  documentType: string;

  @IsNotEmpty()
  @IsString()
  documentNumber: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => KeyDto)
  key?: KeyDto;
}
