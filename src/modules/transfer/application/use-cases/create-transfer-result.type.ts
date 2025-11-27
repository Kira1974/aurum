import { Transfer } from '~/modules/transfer/domain/entities/transfer.entity';
import { Notification } from '~/modules/transfer/domain/value-objects/notification.vo';

export interface CreateTransferResult {
  transfer: Transfer;
  notification?: Notification;
}
