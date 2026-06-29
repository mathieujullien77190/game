"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformer = exports.syncTransformerCounter = void 0;
const constants_1 = require("../constants");
let transformerCounter = 0;
const syncTransformerCounter = (ids) => {
    let max = 0;
    for (const id of ids) {
        const m = id.match(/^transform(\d+)$/);
        if (m)
            max = Math.max(max, parseInt(m[1]));
    }
    transformerCounter = max;
};
exports.syncTransformerCounter = syncTransformerCounter;
const generateTransformerId = () => `transform${++transformerCounter}`;
class Transformer {
    constructor(linkId, type = "color", id, amount = 0.5, color = constants_1.COLOR_TOKEN_RED, targetType = "square", screenId) {
        this.screenId = "main";
        this.id = id ?? generateTransformerId();
        this.linkId = linkId;
        this.type = type;
        this.amount = amount;
        this.color = color;
        this.targetType = targetType;
        if (screenId)
            this.screenId = screenId;
    }
}
exports.Transformer = Transformer;
