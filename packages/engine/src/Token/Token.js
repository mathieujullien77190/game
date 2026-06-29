"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.TOKEN_COLORS = exports.syncTokenCounter = void 0;
const constants_1 = require("../constants");
let tokenCounter = 1;
const syncTokenCounter = (ids) => {
    const max = ids.reduce((m, id) => {
        const n = parseInt(id.replace("token", ""));
        return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    if (max >= tokenCounter)
        tokenCounter = max + 1;
};
exports.syncTokenCounter = syncTokenCounter;
exports.TOKEN_COLORS = [
    constants_1.COLOR_TOKEN_RED,
    constants_1.COLOR_TOKEN_ORANGE,
    constants_1.COLOR_TOKEN_YELLOW,
    constants_1.COLOR_TOKEN_GREEN,
    constants_1.COLOR_TOKEN_CYAN,
    constants_1.COLOR_TOKEN_BLUE,
    constants_1.COLOR_TOKEN_PURPLE,
    constants_1.COLOR_TOKEN_PINK,
    constants_1.COLOR_TOKEN_SLATE,
    constants_1.COLOR_TOKEN_DARK,
];
class Token {
    constructor(color, speed, id, type = "round") {
        this.id = id ?? `token${tokenCounter++}`;
        this.color = color;
        this.type = type;
        this.speed = speed;
    }
}
exports.Token = Token;
