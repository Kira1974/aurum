import { IsNotEmpty, IsString } from 'class-validator';

export class ContextDto {
  @IsNotEmpty()
  @IsString()
  pointOfSale: string;

  @IsNotEmpty()
  @IsString()
  terminal: string;

  @IsNotEmpty()
  @IsString()
  productCode: string;

  @IsNotEmpty()
  @IsString()
  trace: string;
}
