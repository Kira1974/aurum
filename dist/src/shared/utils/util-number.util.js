"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNumbers = addNumbers;
exports.capitalize = capitalize;
function addNumbers(a, b) {
    return a + b;
}
function capitalize(text) {
    if (!text)
        return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}
//# sourceMappingURL=util-number.util.js.map