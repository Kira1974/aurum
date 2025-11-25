import { IsNotEmpty, IsString } from 'class-validator';

export class KeyDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}
