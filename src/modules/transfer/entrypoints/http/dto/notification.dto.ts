import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  @IsString()
  channel: string;

  @IsNotEmpty()
  @IsString()
  cellphone: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
