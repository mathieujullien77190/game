"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineEditor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Line_1 = require("./Line");
const lineUtils_1 = require("./lineUtils");
const constants_1 = require("../constants");
const lineMid = (line) => {
    if (line.type === "curve" || line.type === "elbow") {
        const { start: s, end: e, cp1, cp2 } = line;
        return {
            x: 0.125 * s.x + 0.375 * cp1.x + 0.375 * cp2.x + 0.125 * e.x,
            y: 0.125 * s.y + 0.375 * cp1.y + 0.375 * cp2.y + 0.125 * e.y,
        };
    }
    if (line.points.length > 0) {
        const mid = line.points[Math.floor(line.points.length / 2)];
        return { x: mid.x, y: mid.y };
    }
    return { x: (line.start.x + line.end.x) / 2, y: (line.start.y + line.end.y) / 2 };
};
class LineEditor extends Line_1.Line {
    constructor() {
        super(...arguments);
        this.render = (hovered, showIds) => {
            const { GUIDE_STROKE, GUIDE_STROKE_WIDTH, GUIDE_DASH, CP1_COLOR, CP2_COLOR, CP_R, CORNER_R, CORNER_STROKE, CORNER_STROKE_WIDTH, START_R, START_COLOR, END_R, END_COLOR, LINE_STROKE, LINE_STROKE_HOVERED, LINE_STROKE_WIDTH, LINE_STROKE_WIDTH_HOVERED, LINE_DASH, LABEL_FONT_SIZE, LABEL_OFFSET_Y, LABEL_COLOR, } = LineEditor;
            const mid = showIds ? lineMid(this) : null;
            const corner = this.type === "elbow"
                ? this.flip
                    ? { x: this.end.x, y: this.start.y }
                    : { x: this.start.x, y: this.end.y }
                : null;
            return ((0, jsx_runtime_1.jsxs)("g", { children: [this.type === "curve" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("line", { x1: this.start.x, y1: this.start.y, x2: this.cp1.x, y2: this.cp1.y, stroke: GUIDE_STROKE, strokeWidth: GUIDE_STROKE_WIDTH, strokeDasharray: GUIDE_DASH }), (0, jsx_runtime_1.jsx)("line", { x1: this.end.x, y1: this.end.y, x2: this.cp2.x, y2: this.cp2.y, stroke: GUIDE_STROKE, strokeWidth: GUIDE_STROKE_WIDTH, strokeDasharray: GUIDE_DASH })] })), (0, jsx_runtime_1.jsx)("path", { d: (0, lineUtils_1.linePath)(this), fill: "none", stroke: hovered ? LINE_STROKE_HOVERED : LINE_STROKE, strokeWidth: hovered ? LINE_STROKE_WIDTH_HOVERED : LINE_STROKE_WIDTH, strokeDasharray: LINE_DASH, strokeLinecap: "round" }), this.type === "curve" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("circle", { cx: this.cp1.x, cy: this.cp1.y, r: CP_R, fill: CP1_COLOR }), (0, jsx_runtime_1.jsx)("circle", { cx: this.cp2.x, cy: this.cp2.y, r: CP_R, fill: CP2_COLOR })] })), corner && ((0, jsx_runtime_1.jsx)("circle", { cx: corner.x, cy: corner.y, r: CORNER_R, fill: "#fff", stroke: CORNER_STROKE, strokeWidth: CORNER_STROKE_WIDTH })), (0, jsx_runtime_1.jsx)("circle", { cx: this.start.x, cy: this.start.y, r: START_R, fill: START_COLOR }), (0, jsx_runtime_1.jsx)("circle", { cx: this.end.x, cy: this.end.y, r: END_R, fill: END_COLOR }), mid && ((0, jsx_runtime_1.jsx)("text", { x: mid.x, y: mid.y - LABEL_OFFSET_Y, textAnchor: "middle", dominantBaseline: "middle", fontFamily: constants_1.GAME_FONT, fontSize: LABEL_FONT_SIZE, fontWeight: "bold", fill: LABEL_COLOR, children: this.id }))] }, this.id));
        };
    }
}
exports.LineEditor = LineEditor;
LineEditor.GUIDE_STROKE = "#ccc";
LineEditor.GUIDE_STROKE_WIDTH = 1;
LineEditor.GUIDE_DASH = "3 3";
LineEditor.CP1_COLOR = "#4caf50";
LineEditor.CP2_COLOR = "#9c27b0";
LineEditor.CP_R = 5;
LineEditor.CORNER_R = 5;
LineEditor.CORNER_STROKE = "#666";
LineEditor.CORNER_STROKE_WIDTH = 1.5;
LineEditor.START_R = 5;
LineEditor.START_COLOR = constants_1.COLOR_TOKEN_YELLOW;
LineEditor.END_R = 7;
LineEditor.END_COLOR = constants_1.COLOR_TOKEN_BLUE;
LineEditor.LINE_STROKE = "#999";
LineEditor.LINE_STROKE_HOVERED = "#000";
LineEditor.LINE_STROKE_WIDTH = 2;
LineEditor.LINE_STROKE_WIDTH_HOVERED = 3;
LineEditor.LINE_DASH = "6 5";
LineEditor.LABEL_FONT_SIZE = 10;
LineEditor.LABEL_OFFSET_Y = 10;
LineEditor.LABEL_COLOR = "#333";
