import { Notification } from '~/modules/transfer/domain/value-objects/notification.vo';
import { NotificationChannel } from '~/modules/transfer/domain/constants/notification-channel.enum';

export class NotificationFactory {
  static create(
    channel: NotificationChannel = NotificationChannel.SMS,
    value = '3001234567',
    message = 'Test notification message'
  ): Notification {
    return new Notification(channel, value, message);
  }
}
