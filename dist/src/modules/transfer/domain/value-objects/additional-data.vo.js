"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditionalData = void 0;
class AdditionalData {
    _data;
    constructor(data) {
        this._data = { ...data };
        this.validate();
    }
    validate() {
        const keys = Object.keys(this._data);
        for (const key of keys) {
            const value = this._data[key];
            if (!value || value.trim().length === 0) {
                throw new Error(`AdditionalData: Value for key ${key} must be a non-empty string`);
            }
        }
    }
    get(key) {
        return this._data[key];
    }
    toObject() {
        return { ...this._data };
    }
    has(key) {
        return this._data[key] !== undefined;
    }
    keys() {
        return Object.keys(this._data);
    }
    add(key, value) {
        if (!value || value.trim().length === 0) {
            throw new Error(`AdditionalData: Value for key ${key} must be a non-empty string`);
        }
        return new AdditionalData({
            ...this._data,
            [key]: value
        });
    }
    addAll(data) {
        return new AdditionalData({
            ...this._data,
            ...data
        });
    }
    equals(other) {
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
    static empty() {
        return new AdditionalData({});
    }
}
exports.AdditionalData = AdditionalData;
//# sourceMappingURL=additional-data.vo.js.map