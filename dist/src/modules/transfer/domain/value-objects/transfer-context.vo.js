"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferContext = void 0;
class TransferContext {
    _pointOfSale;
    _terminal;
    _h2hPointOfSale;
    _transactionalPassword;
    _productCode;
    _trace;
    constructor(pointOfSale, terminal, h2hPointOfSale, transactionalPassword, productCode, trace) {
        this._pointOfSale = pointOfSale;
        this._terminal = terminal;
        this._h2hPointOfSale = h2hPointOfSale;
        this._transactionalPassword = transactionalPassword;
        this._productCode = productCode;
        this._trace = trace;
        this.validate();
    }
    validate() {
        this.ensureNotBlank('pointOfSale', this._pointOfSale);
        this.ensureNotBlank('terminal', this._terminal);
        this.ensureNotBlank('h2hPointOfSale', this._h2hPointOfSale);
        this.ensureNotBlank('transactionalPassword', this._transactionalPassword);
        this.ensureNotBlank('productCode', this._productCode);
        this.ensureNotBlank('trace', this._trace);
    }
    ensureNotBlank(field, value) {
        if (!value || value.trim().length === 0) {
            throw new Error(`TransferContext: ${field} must not be empty`);
        }
    }
    get pointOfSale() {
        return this._pointOfSale;
    }
    get terminal() {
        return this._terminal;
    }
    get h2hPointOfSale() {
        return this._h2hPointOfSale;
    }
    get transactionalPassword() {
        return this._transactionalPassword;
    }
    get productCode() {
        return this._productCode;
    }
    get trace() {
        return this._trace;
    }
    equals(other) {
        return (this._pointOfSale === other._pointOfSale &&
            this._terminal === other._terminal &&
            this._h2hPointOfSale === other._h2hPointOfSale &&
            this._transactionalPassword === other._transactionalPassword &&
            this._productCode === other._productCode &&
            this._trace === other._trace);
    }
}
exports.TransferContext = TransferContext;
//# sourceMappingURL=transfer-context.vo.js.map