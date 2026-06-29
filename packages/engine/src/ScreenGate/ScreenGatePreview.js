"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenGatePreview = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SVG = __importStar(require("../svgElements"));
const ScreenGate_1 = require("./ScreenGate");
const ScreenGateEditor_1 = require("./ScreenGateEditor");
const constants_1 = require("../constants");
const miniToken_1 = require("../miniToken");
class ScreenGatePreview extends ScreenGate_1.ScreenGate {
    constructor(linkId, targetScreenId, entryKey, exitKey, id, screenId) {
        super(linkId, id);
        this.timeMultiplier = 1;
        this.render = (links, lines, tokens, elapsed, sid) => {
            if (this.screenId !== sid)
                return null;
            const link = links[this.linkId];
            if (!link)
                return null;
            const line = lines[link.line1.lineId];
            if (!line)
                return null;
            const pt = link.line1.endpoint === "end" ? line.end : line.start;
            const { CORNER_RX, STROKE_WIDTH, LABEL_FONT_SIZE, MINI_TOKEN_R } = ScreenGatePreview;
            const S = ScreenGateEditor_1.GATE_W / constants_1.CANVAS_W;
            const tokensInside = tokens.filter((t) => {
                const tLine = lines[t.lineId];
                return elapsed >= t.startAt && tLine?.screenId === this.targetScreenId;
            });
            return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [(0, jsx_runtime_1.jsx)(SVG.rect, { x: pt.x - ScreenGateEditor_1.GATE_W / 2, y: pt.y - ScreenGateEditor_1.GATE_H / 2, width: ScreenGateEditor_1.GATE_W, height: ScreenGateEditor_1.GATE_H, rx: CORNER_RX, fill: constants_1.COLOR_WHITE, stroke: constants_1.COLOR_GRAY, strokeWidth: STROKE_WIDTH }), this.timeMultiplier !== 1 && ((0, jsx_runtime_1.jsx)(SVG.text, { x: pt.x, y: pt.y, textAnchor: "middle", dominantBaseline: "middle", fontFamily: constants_1.GAME_FONT, fontSize: LABEL_FONT_SIZE, fontWeight: "bold", fill: constants_1.COLOR_GRAY, children: this.timeMultiplier > 1
                            ? `+${Math.round(this.timeMultiplier)}`
                            : `-${Math.round(1 / this.timeMultiplier)}` })), (0, jsx_runtime_1.jsx)(SVG.clipPath, { id: `sgclip-${this.id}`, children: (0, jsx_runtime_1.jsx)(SVG.rect, { x: pt.x - ScreenGateEditor_1.GATE_W / 2, y: pt.y - ScreenGateEditor_1.GATE_H / 2, width: ScreenGateEditor_1.GATE_W, height: ScreenGateEditor_1.GATE_H, rx: CORNER_RX }) }), (0, jsx_runtime_1.jsx)(SVG.g, { clipPath: `url(#sgclip-${this.id})`, children: tokensInside.map((t) => {
                            const tLine = lines[t.lineId];
                            const tp = tLine?.points[t.pointIndex];
                            if (!tp)
                                return null;
                            const dx = pt.x - ScreenGateEditor_1.GATE_W / 2 + tp.x * S;
                            const dy = pt.y - ScreenGateEditor_1.GATE_H / 2 + tp.y * S;
                            const color = (t.displayColor || t.color);
                            return (0, miniToken_1.miniToken)(t.id, dx, dy, MINI_TOKEN_R, color, t.type === "square");
                        }) })] }, this.id));
        };
        this.renderMarkers = (lines, sid) => {
            if (this.targetScreenId !== sid)
                return null;
            const { ENTRY_MARKER_R, EXIT_OUTER_R, EXIT_INNER_R, STROKE_WIDTH } = ScreenGatePreview;
            const nodes = [];
            if (this.entryKey) {
                const [eLineId, eEp] = this.entryKey.split("::");
                const eLine = lines[eLineId];
                if (eLine) {
                    const pt = eEp === "end" ? eLine.end : eLine.start;
                    nodes.push((0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: ENTRY_MARKER_R, fill: constants_1.COLOR_GRAY_ACCENT }, `en-${this.id}`));
                }
            }
            if (this.exitKey) {
                const [xLineId, xEp] = this.exitKey.split("::");
                const xLine = lines[xLineId];
                if (xLine) {
                    const pt = xEp === "end" ? xLine.end : xLine.start;
                    nodes.push((0, jsx_runtime_1.jsxs)(SVG.g, { children: [(0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: EXIT_OUTER_R, fill: "none", stroke: constants_1.COLOR_GRAY_ACCENT, strokeWidth: STROKE_WIDTH }), (0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: EXIT_INNER_R, fill: constants_1.COLOR_GRAY_ACCENT })] }, `ex-${this.id}`));
                }
            }
            if (nodes.length === 0)
                return null;
            return (0, jsx_runtime_1.jsx)(SVG.g, { children: nodes }, `marker-${this.id}`);
        };
        this.targetScreenId = targetScreenId;
        this.entryKey = entryKey;
        this.exitKey = exitKey;
        if (screenId)
            this.screenId = screenId;
    }
}
exports.ScreenGatePreview = ScreenGatePreview;
ScreenGatePreview.CORNER_RX = 5;
ScreenGatePreview.STROKE_WIDTH = 4;
ScreenGatePreview.LABEL_FONT_SIZE = 14;
ScreenGatePreview.ENTRY_MARKER_R = 4;
ScreenGatePreview.EXIT_OUTER_R = 10;
ScreenGatePreview.EXIT_INNER_R = 4;
ScreenGatePreview.MINI_TOKEN_R = 2;
ScreenGatePreview.MINI_STROKE_WIDTH = 0.5;
