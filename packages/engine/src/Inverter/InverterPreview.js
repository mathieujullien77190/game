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
exports.InverterPreview = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SVG = __importStar(require("../svgElements"));
const Inverter_1 = require("./Inverter");
const DOT_R = 5;
const DOT_GAP = 14;
const COLOR_ON = "#4caf50";
const COLOR_OFF = "#e53935";
class InverterPreview extends Inverter_1.Inverter {
    constructor() {
        super(...arguments);
        this.active = false;
        this.render = (links, lines, sid) => {
            const link = links[this.linkId];
            if (!link)
                return null;
            const line = lines[link.line1.lineId];
            if (!line || line.screenId !== sid || line.points.length === 0)
                return null;
            const isEnd = link.line1.endpoint === "end";
            const pt = isEnd ? line.end : line.start;
            const ptAngle = isEnd ? line.points[line.points.length - 1] : line.points[0];
            const angle = ptAngle?.angle ?? 0;
            const perp = angle + Math.PI / 2;
            const ox = Math.cos(perp) * DOT_GAP;
            const oy = Math.sin(perp) * DOT_GAP;
            return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [(0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x - ox, cy: pt.y - oy, r: DOT_R, fill: COLOR_OFF, opacity: this.active ? 0.1 : 1 }), (0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x + ox, cy: pt.y + oy, r: DOT_R, fill: COLOR_ON, opacity: this.active ? 1 : 0.1 })] }, this.id));
        };
    }
}
exports.InverterPreview = InverterPreview;
