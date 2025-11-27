import { NotificationChannel } from '../constants/notification-channel.enum';

export class Notification {
  readonly channel: NotificationChannel;
  readonly value: string;
  readonly message: string;

  constructor(channel: NotificationChannel, value: string, message: string) {
    this.channel = channel;
    this.value = value;
    this.message = message;
  }
}
