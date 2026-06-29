"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = exports.syncSwitchCounter = void 0;
let switchCounter = 1;
const syncSwitchCounter = (ids) => {
    const max = ids.reduce((m, id) => {
        const n = parseInt(id.replace("switch", ""));
        return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    if (max >= switchCounter)
        switchCounter = max + 1;
};
exports.syncSwitchCounter = syncSwitchCounter;
class Switch {
    constructor(id, linkIds, activeLinkId, screenId) {
        this.screenId = "main";
        this.color = "#1a73e8";
        this.id = id ?? `switch${switchCounter++}`;
        this.linkIds = linkIds ?? [];
        this.activeLinkId = activeLinkId ?? null;
        if (screenId)
            this.screenId = screenId;
    }
}
exports.Switch = Switch;
