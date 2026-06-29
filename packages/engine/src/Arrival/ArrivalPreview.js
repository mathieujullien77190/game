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
exports.ArrivalPreview = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SVG = __importStar(require("../svgElements"));
const Arrival_1 = require("./Arrival");
const constants_1 = require("../constants");
const ARC_COLOR = "#999";
const ARC_GAP = 0.05;
const arcPath = (cx, cy, r, a0, a1) => {
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M${x0},${y0}A${r},${r},0,${large},1,${x1},${y1}`;
};
class ArrivalPreview extends Arrival_1.Arrival {
    constructor() {
        super(...arguments);
        this.currentDemandIndex = 0;
        this.correctCount = 0;
        this.arcFill = 0;
        this.arcTarget = 0;
        this.flashColor = null;
        this.flashProgress = 0;
        this._cache = null;
        this.render = (lines, sid) => {
            const line = lines[this.lineId];
            if (!line || line.screenId !== sid) {
                this._cache = null;
                return null;
            }
            const pt = this.endpoint === "end"
                ? line.points[line.points.length - 1]
                : line.points[0];
            if (!pt) {
                this._cache = null;
                return null;
            }
            const lineAngle = this.endpoint === "end" ? pt.angle + Math.PI : pt.angle;
            this._cache = { pt, lineAngle };
            return null;
        };
        this.renderAfter = () => {
            const c = this._cache;
            if (!c)
                return null;
            const { pt, lineAngle } = c;
            const { OUTER_R: r, OUTER_STROKE_WIDTH: sw } = ArrivalPreview;
            const n = this.demands.length;
            const demand = this.demands[this.currentDemandIndex];
            const flashOpacity = this.flashColor ? (1 - this.flashProgress) * 0.55 : 0;
            const elems = [];
            elems.push((0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: r, fill: "none", stroke: constants_1.COLOR_GRAY, strokeWidth: sw }, "base"));
            if (this.arcFill > 0 && n > 0) {
                const segSpan = (Math.PI * 2) / n;
                const gap = n > 1 ? ARC_GAP : 0;
                const completedFull = Math.floor(this.arcFill);
                const partial = this.arcFill - completedFull;
                for (let k = 0; k < n; k++) {
                    const a0 = lineAngle + k * segSpan + gap / 2;
                    const a1 = lineAngle + (k + 1) * segSpan - gap / 2;
                    if (k < completedFull) {
                        elems.push((0, jsx_runtime_1.jsx)(SVG.path, { d: arcPath(pt.x, pt.y, r, a0, a1), fill: "none", stroke: ARC_COLOR, strokeWidth: sw, strokeLinecap: "round" }, `arc-${k}`));
                    }
                    else if (k === completedFull && partial > 0) {
                        const a1p = a0 + (a1 - a0) * partial;
                        elems.push((0, jsx_runtime_1.jsx)(SVG.path, { d: arcPath(pt.x, pt.y, r, a0, a1p), fill: "none", stroke: ARC_COLOR, strokeWidth: sw, strokeLinecap: "round" }, `arc-${k}`));
                    }
                }
            }
            if (this.flashColor)
                elems.push((0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: r + sw / 2, fill: "none", stroke: this.flashColor, strokeWidth: sw * 2, opacity: flashOpacity }, "flash"));
            if (demand)
                elems.push((0, jsx_runtime_1.jsx)(SVG.g, { children: ArrivalPreview.demandToken(pt.x, pt.y, demand.color, demand.type, demand.angled) }, "demand"));
            return (0, jsx_runtime_1.jsx)(SVG.g, { children: elems }, `aa-${this.id}`);
        };
    }
}
exports.ArrivalPreview = ArrivalPreview;
ArrivalPreview.OUTER_R = 17;
ArrivalPreview.OUTER_STROKE_WIDTH = 4;
ArrivalPreview.DEMAND_R = 8;
ArrivalPreview.DEMAND_SQUARE_HALF = 8;
ArrivalPreview.DEMAND_SQUARE_RX = 3;
ArrivalPreview.demandToken = (x, y, color, type, angled) => {
    const { DEMAND_SQUARE_HALF: dsh, DEMAND_SQUARE_RX: drx, DEMAND_R } = ArrivalPreview;
    if (type === "square") {
        return ((0, jsx_runtime_1.jsx)(SVG.rect, { x: x - dsh, y: y - dsh, width: dsh * 2, height: dsh * 2, rx: drx, fill: color, transform: angled ? `rotate(45,${x},${y})` : undefined }));
    }
    return (0, jsx_runtime_1.jsx)(SVG.circle, { cx: x, cy: y, r: DEMAND_R, fill: color });
};
