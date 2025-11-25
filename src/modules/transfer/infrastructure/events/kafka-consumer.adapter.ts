import { IEventConsumer } from '~/modules/transfer/application/ports';

export class KafkaConsumerAdapter implements IEventConsumer {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  subscribe(__: (event: unknown) => void, ___: (raw: unknown) => void): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ack(__: unknown): void {}
}
