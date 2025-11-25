import { IsNotEmpty, IsString } from 'class-validator';

export class MerchantResponseDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;
}
