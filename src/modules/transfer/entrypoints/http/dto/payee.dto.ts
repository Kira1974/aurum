import { IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AccountInfo {
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class PayeeRequestDto {
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

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AccountInfo)
  accountInfo: AccountInfo;
}

export class PayeeResponseDto {
  customerId?: string;
  accountInfo?: AccountInfo;
}
