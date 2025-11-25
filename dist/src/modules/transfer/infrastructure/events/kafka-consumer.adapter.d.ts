import { IEventConsumer } from '~/modules/transfer/application/ports';
export declare class KafkaConsumerAdapter implements IEventConsumer {
    subscribe(__: (event: unknown) => void, ___: (raw: unknown) => void): void;
    ack(__: unknown): void;
}
