"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenGate = exports.syncScreenGateCounter = void 0;
let screenGateCounter = 0;
const syncScreenGateCounter = (ids) => {
    let max = 0;
    for (const id of ids) {
        const m = id.match(/^gate(\d+)$/);
        if (m)
            max = Math.max(max, parseInt(m[1]));
    }
    screenGateCounter = max;
};
exports.syncScreenGateCounter = syncScreenGateCounter;
const generateScreenGateId = () => `gate${++screenGateCounter}`;
class ScreenGate {
    constructor(linkId, id, screenId, targetScreenId = "", entryKey = "", exitKey = "") {
        this.screenId = "main";
        this.targetScreenId = "";
        this.entryKey = "";
        this.exitKey = "";
        this.id = id ?? generateScreenGateId();
        this.linkId = linkId;
        if (screenId)
            this.screenId = screenId;
        this.targetScreenId = targetScreenId;
        this.entryKey = entryKey;
        this.exitKey = exitKey;
    }
}
exports.ScreenGate = ScreenGate;
