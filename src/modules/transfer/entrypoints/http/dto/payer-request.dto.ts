import { IsNotEmpty, IsString } from 'class-validator';

export class PayerRequestDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  documentType: string;

  @IsNotEmpty()
  @IsString()
  documentNumber: string;
}
