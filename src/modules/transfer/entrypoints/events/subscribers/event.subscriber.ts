export interface IEventConsumer {
  subscribe(handler: (event: unknown) => void, parser: (raw: unknown) => void): void;
  ack(event: unknown): void;
}
