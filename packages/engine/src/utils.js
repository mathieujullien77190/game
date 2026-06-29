"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rng = void 0;
const rng = (seed, i) => {
    const n = Math.sin(seed + i * 9301 + 49297) * 233280;
    return n - Math.floor(n);
};
exports.rng = rng;
