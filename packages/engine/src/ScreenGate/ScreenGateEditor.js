"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenGateEditor = exports.GATE_H = exports.GATE_W = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ScreenGate_1 = require("./ScreenGate");
exports.GATE_W = 36;
exports.GATE_H = 64;
class ScreenGateEditor extends ScreenGate_1.ScreenGate {
    constructor() {
        super(...arguments);
        this.render = (links, lines, hovered) => {
            const link = links[this.linkId];
            if (!link)
                return null;
            const line = lines[link.line1.lineId];
            if (!line)
                return null;
            const pt = link.line1.endpoint === "end" ? line.end : line.start;
            const { CORNER_RX, STROKE_WIDTH, OPACITY_DEFAULT } = ScreenGateEditor;
            return ((0, jsx_runtime_1.jsx)("rect", { x: pt.x - exports.GATE_W / 2, y: pt.y - exports.GATE_H / 2, width: exports.GATE_W, height: exports.GATE_H, rx: CORNER_RX, fill: "#fff", stroke: "#000", strokeWidth: STROKE_WIDTH, opacity: hovered ? 1 : OPACITY_DEFAULT }, this.id));
        };
        this.renderMarker = (lines) => {
            const { ENTRY_MARKER_R, EXIT_OUTER_R, EXIT_INNER_R } = ScreenGateEditor;
            const nodes = [];
            if (this.entryKey) {
                const [eLineId, eEp] = this.entryKey.split("::");
                const eLine = lines[eLineId];
                if (eLine) {
                    const pt = eEp === "end" ? eLine.end : eLine.start;
                    nodes.push((0, jsx_runtime_1.jsx)("circle", { cx: pt.x, cy: pt.y, r: ENTRY_MARKER_R, fill: "#000" }, `entry-${this.id}`));
                }
            }
            if (this.exitKey) {
                const [xLineId, xEp] = this.exitKey.split("::");
                const xLine = lines[xLineId];
                if (xLine) {
                    const pt = xEp === "end" ? xLine.end : xLine.start;
                    nodes.push((0, jsx_runtime_1.jsxs)("g", { children: [(0, jsx_runtime_1.jsx)("circle", { cx: pt.x, cy: pt.y, r: EXIT_OUTER_R, fill: "none", stroke: "#000", strokeWidth: 2 }), (0, jsx_runtime_1.jsx)("circle", { cx: pt.x, cy: pt.y, r: EXIT_INNER_R, fill: "#000" })] }, `exit-${this.id}`));
                }
            }
            if (nodes.length === 0)
                return null;
            return (0, jsx_runtime_1.jsx)("g", { children: nodes }, `marker-${this.id}`);
        };
    }
}
exports.ScreenGateEditor = ScreenGateEditor;
ScreenGateEditor.CORNER_RX = 5;
ScreenGateEditor.STROKE_WIDTH = 2;
ScreenGateEditor.ENTRY_MARKER_R = 4;
ScreenGateEditor.EXIT_OUTER_R = 8;
ScreenGateEditor.EXIT_INNER_R = 4;
ScreenGateEditor.OPACITY_DEFAULT = 0.4;
