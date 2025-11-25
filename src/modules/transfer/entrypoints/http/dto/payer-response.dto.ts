import { IsNotEmpty, IsString } from 'class-validator';

export class PayerResponseDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;
}
