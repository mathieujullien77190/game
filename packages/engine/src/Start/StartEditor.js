"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartEditor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Start_1 = require("./Start");
class StartEditor extends Start_1.Start {
    constructor() {
        super(...arguments);
        this.render = (lines) => {
            const line = lines[this.lineId];
            if (!line)
                return null;
            const pt = this.endpoint === "end" ? line.end : line.start;
            const { RADIUS: r, ARROW_BACK_X: bx, ARROW_FRONT_X: fx, ARROW_HALF_H: hy } = StartEditor;
            return ((0, jsx_runtime_1.jsxs)("g", { children: [(0, jsx_runtime_1.jsx)("circle", { cx: pt.x, cy: pt.y, r: r, fill: "#000" }), (0, jsx_runtime_1.jsx)("polygon", { points: `${pt.x - bx},${pt.y - hy} ${pt.x + fx},${pt.y} ${pt.x - bx},${pt.y + hy}`, fill: "#fff" })] }, this.id));
        };
    }
}
exports.StartEditor = StartEditor;
StartEditor.RADIUS = 14;
StartEditor.ARROW_BACK_X = 4;
StartEditor.ARROW_FRONT_X = 8;
StartEditor.ARROW_HALF_H = 6;
