"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inverter = exports.syncInverterCounter = void 0;
let inverterCounter = 0;
const syncInverterCounter = (ids) => {
    let max = 0;
    for (const id of ids) {
        const m = id.match(/^inv(\d+)$/);
        if (m)
            max = Math.max(max, parseInt(m[1]));
    }
    inverterCounter = max;
};
exports.syncInverterCounter = syncInverterCounter;
const generateInverterId = () => `inv${++inverterCounter}`;
class Inverter {
    constructor(linkId, id, screenId) {
        this.screenId = "main";
        this.effect = "invert";
        this.id = id ?? generateInverterId();
        this.linkId = linkId;
        if (screenId)
            this.screenId = screenId;
    }
}
exports.Inverter = Inverter;
