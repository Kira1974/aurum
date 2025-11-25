import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AmountDto {
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  currency: string;
}
