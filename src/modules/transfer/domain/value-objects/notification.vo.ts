import { format } from 'util';

import { formatAmount } from '~/shared/utils/amount-utils.utils';

import { NotificationChannel } from '../constants/notification-channel.enum';
import { NOTIFICATION_MESSAGE_TEMPLATE } from '../constants/notification.constants';

export interface SuccessTransferNotificationData {
  value: string;
  companyName: string;
  amount: number;
  formattedAccount: string;
  transactionTime: Date;
  processor: string;
}

export class Notification {
  readonly channel: NotificationChannel;
  readonly value: string;
  readonly message: string;

  constructor(channel: NotificationChannel, value: string, message: string) {
    this.channel = channel;
    this.value = value;
    this.message = message;
  }

  static forSuccessTransfer(data: SuccessTransferNotificationData): Notification {
    const formattedAmount = formatAmount(data.amount);
    const formattedAccount = data.formattedAccount || '';
    const formattedTime = data.transactionTime.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const message = format(
      NOTIFICATION_MESSAGE_TEMPLATE,
      data.companyName,
      formattedAmount,
      formattedAccount,
      formattedTime,
      data.processor
    );

    return new Notification(NotificationChannel.SMS, data.value, message);
  }
}
