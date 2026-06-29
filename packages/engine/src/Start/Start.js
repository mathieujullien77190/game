"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Start = exports.syncStartCounter = void 0;
let startCounter = 1;
const syncStartCounter = (ids) => {
    const max = ids.reduce((m, id) => {
        const n = parseInt(id.replace("start", ""));
        return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    if (max >= startCounter)
        startCounter = max + 1;
};
exports.syncStartCounter = syncStartCounter;
class Start {
    constructor(lineId, endpoint, delay = 6, id, screenId) {
        this.screenId = "main";
        this.id = id ?? `start${startCounter++}`;
        this.lineId = lineId;
        this.endpoint = endpoint;
        this.delay = delay;
        if (screenId)
            this.screenId = screenId;
    }
}
exports.Start = Start;
