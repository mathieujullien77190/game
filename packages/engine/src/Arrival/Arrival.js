"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arrival = exports.makeDemand = exports.syncArrivalCounter = void 0;
const constants_1 = require("../constants");
let arrivalCounter = 1;
let demandCounter = 1;
const syncArrivalCounter = (ids) => {
    const max = ids.reduce((m, id) => {
        const n = parseInt(id.replace("arrival", ""));
        return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    if (max >= arrivalCounter)
        arrivalCounter = max + 1;
};
exports.syncArrivalCounter = syncArrivalCounter;
const makeDemand = (color = constants_1.COLOR_TOKEN_RED, type = "round", angled = false) => ({
    id: `demand${demandCounter++}`,
    color,
    type,
    angled,
});
exports.makeDemand = makeDemand;
class Arrival {
    constructor(lineId, endpoint, id, demands = [], screenId) {
        this.screenId = "main";
        this.id = id ?? `arrival${arrivalCounter++}`;
        this.lineId = lineId;
        this.endpoint = endpoint;
        this.demands = demands;
        if (screenId)
            this.screenId = screenId;
    }
}
exports.Arrival = Arrival;
