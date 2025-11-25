import { IsNotEmpty, IsString } from 'class-validator';

export class PayeeResponseDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;
}
