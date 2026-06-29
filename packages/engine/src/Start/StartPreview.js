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
exports.StartPreview = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SVG = __importStar(require("../svgElements"));
const Start_1 = require("./Start");
const constants_1 = require("../constants");
class StartPreview extends Start_1.Start {
    constructor() {
        super(...arguments);
        this.render = (lines, tokens, elapsed, sid) => {
            const line = lines[this.lineId];
            if (!line || line.screenId !== sid) {
                this._renderCache = null;
                return null;
            }
            const pt = this.endpoint === "end"
                ? line.points[line.points.length - 1]
                : line.points[0];
            if (!pt)
                return null;
            const { RADIUS: r, STROKE_WIDTH: sw, RING_IDLE_COLOR: idleColor, RING_ACTIVE_COLOR: activeColor, } = StartPreview;
            const nextWaiting = tokens
                .filter((t) => t.startId === this.id && elapsed < t.startAt)
                .sort((a, b) => a.startAt - b.startAt)[0];
            const remaining = nextWaiting ? nextWaiting.startAt - elapsed : 0;
            const tokenColor = nextWaiting ? (nextWaiting.displayColor || nextWaiting.color) : activeColor;
            const progress = this.delay > 0 && remaining > 0 ? 1 - remaining / this.delay : 0;
            const angle = this.endpoint === "end" ? pt.angle + Math.PI : pt.angle;
            const arcEnd = angle + progress * Math.PI * 2;
            const largeArc = progress > 0.5 ? 1 : 0;
            this._renderCache = { pt, r, sw, idleColor, activeColor, angle, arcEnd, largeArc, progress, remaining, nextWaiting, tokenColor };
            return ((0, jsx_runtime_1.jsx)(SVG.g, { children: nextWaiting && nextWaiting.renderShape(pt.x, pt.y, pt.angle) }, this.id));
        };
        this._renderCache = null;
        this.renderAfter = () => {
            const c = this._renderCache;
            if (!c)
                return null;
            const { pt, r, sw, idleColor, activeColor, angle, arcEnd, largeArc, progress, remaining, nextWaiting, tokenColor } = c;
            return ((0, jsx_runtime_1.jsx)(SVG.g, { children: remaining > 0 && this.delay > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: r, fill: "none", stroke: idleColor, strokeWidth: sw }), progress > 0 && ((0, jsx_runtime_1.jsx)(SVG.path, { d: `M${pt.x + r * Math.cos(angle)},${pt.y + r * Math.sin(angle)}A${r},${r},0,${largeArc},1,${pt.x + r * Math.cos(arcEnd)},${pt.y + r * Math.sin(arcEnd)}`, fill: "none", stroke: tokenColor, strokeWidth: sw, strokeLinecap: "round" }))] })) : ((0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: r, fill: "none", stroke: nextWaiting ? activeColor : idleColor, strokeWidth: sw })) }, `sa-${this.id}`));
        };
    }
}
exports.StartPreview = StartPreview;
StartPreview.RADIUS = 17;
StartPreview.STROKE_WIDTH = 4;
StartPreview.RING_IDLE_COLOR = "#999";
StartPreview.RING_ACTIVE_COLOR = constants_1.COLOR_BLACK;
