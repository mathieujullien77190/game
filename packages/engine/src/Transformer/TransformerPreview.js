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
exports.TransformerPreview = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SVG = __importStar(require("../svgElements"));
const Transformer_1 = require("./Transformer");
const constants_1 = require("../constants");
const ORBIT_R = 20;
const ORBIT_DOT_R = 3;
const SPIRAL_TURNS = 6;
const SPIRAL_STROKE_WIDTH = 4;
const IDLE_DOT_SPEED = 0.4;
const DOT_INITIAL_ANGLE = Math.PI / 4;
const TRAIL_SPAN = Math.PI * 0.5;
const TRAIL_SEGS = 12;
const CENTER_R = 5;
const CENTER_SQUARE_HALF = 5;
const CENTER_SQUARE_RX = 2;
const CENTER_COLOR_R = 4;
class TransformerPreview extends Transformer_1.Transformer {
    constructor() {
        super(...arguments);
        this.transformProgress = -1;
        this.currentTokenColor = "";
        this.dotAngle = (elapsed) => this.transformProgress >= 0
            ? DOT_INITIAL_ANGLE + this.transformProgress * Math.PI * 2 * SPIRAL_TURNS
            : DOT_INITIAL_ANGLE + elapsed * IDLE_DOT_SPEED;
        this.bgCircle = (pt) => ((0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: ORBIT_R, fill: constants_1.COLOR_WHITE, stroke: "#ccc", strokeWidth: 4 }));
        this.orbitDot = (pt, angle) => ((0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x + Math.cos(angle) * ORBIT_R, cy: pt.y + Math.sin(angle) * ORBIT_R, r: ORBIT_DOT_R, fill: "#999" }));
        this.trailArcs = (pt, angle, stroke) => this.transformProgress > 0
            ? Array.from({ length: TRAIL_SEGS }, (_, i) => {
                const a0 = angle - TRAIL_SPAN * (1 - i / TRAIL_SEGS);
                const a1 = angle - TRAIL_SPAN * (1 - (i + 1) / TRAIL_SEGS);
                return ((0, jsx_runtime_1.jsx)(SVG.path, { d: `M${pt.x + ORBIT_R * Math.cos(a0)},${pt.y + ORBIT_R * Math.sin(a0)}A${ORBIT_R},${ORBIT_R},0,0,1,${pt.x + ORBIT_R * Math.cos(a1)},${pt.y + ORBIT_R * Math.sin(a1)}`, fill: "none", stroke: stroke, strokeWidth: SPIRAL_STROKE_WIDTH, strokeLinecap: "butt", opacity: (i + 1) / TRAIL_SEGS }, i));
            })
            : [];
        this.renderRotate = (pt, elapsed) => {
            const { ROTATE_ARC_R: r, ROTATE_ARC_SPAN, ROTATE_SPEED, ROTATE_ARC_COUNT, ROTATE_ARROW_LEN, ROTATE_ARROW_SPREAD, ROTATE_STROKE_WIDTH, } = TransformerPreview;
            const rot = elapsed * ROTATE_SPEED;
            const arcs = [];
            for (let i = 0; i < ROTATE_ARC_COUNT; i++) {
                const start = (i * Math.PI * 2) / ROTATE_ARC_COUNT + rot;
                const end = start + ROTATE_ARC_SPAN;
                const ax = r * Math.cos(end) + pt.x;
                const ay = r * Math.sin(end) + pt.y;
                const backDir = end - Math.PI / 2;
                arcs.push((0, jsx_runtime_1.jsxs)(SVG.g, { children: [(0, jsx_runtime_1.jsx)(SVG.path, { d: `M${pt.x + r * Math.cos(start)},${pt.y + r * Math.sin(start)}A${r},${r},0,0,1,${ax},${ay}`, fill: "none", stroke: "#ccc", strokeWidth: ROTATE_STROKE_WIDTH, strokeLinecap: "round" }), (0, jsx_runtime_1.jsx)(SVG.path, { d: `M${ax + ROTATE_ARROW_LEN * Math.cos(backDir + ROTATE_ARROW_SPREAD)},${ay + ROTATE_ARROW_LEN * Math.sin(backDir + ROTATE_ARROW_SPREAD)}L${ax},${ay}L${ax + ROTATE_ARROW_LEN * Math.cos(backDir - ROTATE_ARROW_SPREAD)},${ay + ROTATE_ARROW_LEN * Math.sin(backDir - ROTATE_ARROW_SPREAD)}`, fill: "none", stroke: "#ccc", strokeWidth: ROTATE_STROKE_WIDTH, strokeLinecap: "round" })] }, i));
            }
            return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [(0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: r + 6, fill: constants_1.COLOR_WHITE }), arcs] }, this.id));
        };
        this.renderFade = (pt, elapsed) => {
            const angle = this.dotAngle(elapsed);
            return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [this.bgCircle(pt), this.trailArcs(pt, angle, "#999"), this.orbitDot(pt, angle), (0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: CENTER_R, fill: "#999", opacity: this.amount })] }, this.id));
        };
        this.renderColor = (pt, elapsed) => {
            const { color, currentTokenColor } = this;
            const angle = this.dotAngle(elapsed);
            return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [this.bgCircle(pt), this.trailArcs(pt, angle, currentTokenColor || color), this.orbitDot(pt, angle), (0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: CENTER_COLOR_R, fill: color })] }, this.id));
        };
        this.renderShape = (pt, elapsed) => {
            const angle = this.dotAngle(elapsed);
            return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [this.bgCircle(pt), this.trailArcs(pt, angle, "#999"), this.orbitDot(pt, angle), this.targetType === "square" ? ((0, jsx_runtime_1.jsx)(SVG.rect, { x: pt.x - CENTER_SQUARE_HALF, y: pt.y - CENTER_SQUARE_HALF, width: CENTER_SQUARE_HALF * 2, height: CENTER_SQUARE_HALF * 2, rx: CENTER_SQUARE_RX, fill: "#999" })) : ((0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: CENTER_R, fill: "#999" }))] }, this.id));
        };
        this.renderAfter = () => null;
        this.render = (pt, elapsed) => {
            switch (this.type) {
                case "rotate": return this.renderRotate(pt, elapsed);
                case "fade": return this.renderFade(pt, elapsed);
                case "color": return this.renderColor(pt, elapsed);
                case "shape": return this.renderShape(pt, elapsed);
            }
        };
    }
}
exports.TransformerPreview = TransformerPreview;
TransformerPreview.ROTATE_ARC_R = 10;
TransformerPreview.ROTATE_ARC_SPAN = Math.PI * 0.5;
TransformerPreview.ROTATE_SPEED = Math.PI * 1.4;
TransformerPreview.ROTATE_ARC_COUNT = 3;
TransformerPreview.ROTATE_ARROW_LEN = 4.5;
TransformerPreview.ROTATE_ARROW_SPREAD = 0.5;
TransformerPreview.ROTATE_STROKE_WIDTH = 2.5;
