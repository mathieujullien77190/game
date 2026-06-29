"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrivalEditor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Arrival_1 = require("./Arrival");
class ArrivalEditor extends Arrival_1.Arrival {
    constructor() {
        super(...arguments);
        this.render = (lines) => {
            const line = lines[this.lineId];
            if (!line)
                return null;
            const pt = this.endpoint === "end" ? line.end : line.start;
            const demand = this.demands[0];
            const { OUTER_R, DEMAND_R, DEMAND_SQUARE_HALF: dsh, DEMAND_SQUARE_RX: drx, DEMAND_STROKE_WIDTH: dsw, EMPTY_SQUARE_HALF: esh } = ArrivalEditor;
            return ((0, jsx_runtime_1.jsxs)("g", { children: [(0, jsx_runtime_1.jsx)("circle", { cx: pt.x, cy: pt.y, r: OUTER_R, fill: "#000" }), !demand && ((0, jsx_runtime_1.jsx)("rect", { x: pt.x - esh, y: pt.y - esh, width: esh * 2, height: esh * 2, fill: "#fff" })), demand && demand.type === "square" && ((0, jsx_runtime_1.jsx)("rect", { x: pt.x - dsh, y: pt.y - dsh, width: dsh * 2, height: dsh * 2, rx: drx, fill: demand.color, stroke: "#000", strokeWidth: dsw, transform: demand.angled ? `rotate(45,${pt.x},${pt.y})` : undefined })), demand && demand.type !== "square" && ((0, jsx_runtime_1.jsx)("circle", { cx: pt.x, cy: pt.y, r: DEMAND_R, fill: demand.color, stroke: "#000", strokeWidth: dsw }))] }, this.id));
        };
    }
}
exports.ArrivalEditor = ArrivalEditor;
ArrivalEditor.OUTER_R = 14;
ArrivalEditor.DEMAND_R = 8;
ArrivalEditor.DEMAND_SQUARE_HALF = 8;
ArrivalEditor.DEMAND_SQUARE_RX = 3;
ArrivalEditor.DEMAND_STROKE_WIDTH = 2;
ArrivalEditor.EMPTY_SQUARE_HALF = 5;
