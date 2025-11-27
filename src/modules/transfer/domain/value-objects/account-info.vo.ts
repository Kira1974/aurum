export class AccountInfo {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('AccountInfo: value must not be empty');
    }
  }
}
