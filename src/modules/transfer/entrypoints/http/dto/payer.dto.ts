import { IsOptional, IsString } from 'class-validator';

import { AccountInfo } from './payee.dto';

export class PayerRequestDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  cellphone?: string;
}

export class PayerResponseDto {
  customerId?: string;
  accountInfo?: AccountInfo;
}
