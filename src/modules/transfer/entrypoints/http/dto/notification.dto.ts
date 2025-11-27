import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  @IsString()
  channel: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
