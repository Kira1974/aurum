import { AdditionalDataKey } from '../constants/additional-data-key.enum';

export class AdditionalData {
  private readonly _data: Partial<Record<AdditionalDataKey, string>>;

  constructor(data: Partial<Record<AdditionalDataKey, string>>) {
    this._data = { ...data };
    this.validate();
  }

  private validate(): void {
    const keys = Object.keys(this._data) as AdditionalDataKey[];
    for (const key of keys) {
      const value = this._data[key];
      if (!value || value.trim().length === 0) {
        throw new Error(`AdditionalData: Value for key ${key} must be a non-empty string`);
      }
    }
  }

  get(key: AdditionalDataKey): string | undefined {
    return this._data[key];
  }

  toObject(): Partial<Record<AdditionalDataKey, string>> {
    return { ...this._data };
  }

  has(key: AdditionalDataKey): boolean {
    return this._data[key] !== undefined;
  }

  keys(): AdditionalDataKey[] {
    return Object.keys(this._data) as AdditionalDataKey[];
  }

  add(key: AdditionalDataKey, value: string): AdditionalData {
    if (!value || value.trim().length === 0) {
      throw new Error(`AdditionalData: Value for key ${key} must be a non-empty string`);
    }

    return new AdditionalData({
      ...this._data,
      [key]: value
    });
  }

  addAll(data: Partial<Record<AdditionalDataKey, string>>): AdditionalData {
    return new AdditionalData({
      ...this._data,
      ...data
    });
  }

  equals(other: AdditionalData): boolean {
    const thisKeys = this.keys();
    const otherKeys = other.keys();

    if (thisKeys.length !== otherKeys.length) {
      return false;
    }

    for (const key of thisKeys) {
      if (this.get(key) !== other.get(key)) {
        return false;
      }
    }

    return true;
  }

  static empty(): AdditionalData {
    return new AdditionalData({});
  }
}
