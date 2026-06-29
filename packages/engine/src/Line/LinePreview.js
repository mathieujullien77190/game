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
exports.LinePreview = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SVG = __importStar(require("../svgElements"));
const Line_1 = require("./Line");
const lineUtils_1 = require("./lineUtils");
const constants_1 = require("../constants");
const svgDot_1 = require("../svgDot");
const constants_2 = require("../constants");
const lineMid = (line) => {
    if (line.points.length === 0)
        return {
            x: (line.start.x + line.end.x) / 2,
            y: (line.start.y + line.end.y) / 2,
        };
    const mid = line.points[Math.floor(line.points.length / 2)];
    return { x: mid.x, y: mid.y };
};
class LinePreview extends Line_1.Line {
    constructor() {
        super(...arguments);
        this.lastSpeed = undefined;
        this.wasSpeeding = false;
        this.limitFlashStart = -999;
        this.render = (elapsed) => {
            const { BOOST_WIN_PX, BOOST_ANIM_SPEED, BOOST_GLOW_COLOR, BOOST_STROKE_WIDTH, TUNNEL_DOT_R, LINE_STROKE, LINE_STROKE_WIDTH, } = LinePreview;
            const boostGlow = (() => {
                if (this.boost === 0 || this.points.length < 2)
                    return null;
                const total = this.points.length;
                const winSize = Math.max(2, Math.floor(BOOST_WIN_PX / constants_1.POINT_SPACING));
                const cycle = total + winSize;
                const rawOffset = Math.floor((elapsed * Math.abs(this.boost) * BOOST_ANIM_SPEED) % cycle) - winSize;
                const tail = Math.max(rawOffset, 0);
                const head = Math.min(rawOffset + winSize, total - 1);
                if (tail >= head)
                    return null;
                const pts = this.points.slice(tail, head + 1);
                const d = `M${pts[0].x},${pts[0].y}` +
                    pts
                        .slice(1)
                        .map((p) => `L${p.x},${p.y}`)
                        .join("");
                return ((0, jsx_runtime_1.jsx)(SVG.path, { d: d, fill: "none", stroke: "orange", strokeWidth: BOOST_STROKE_WIDTH, strokeLinecap: "round", opacity: 0.8 }));
            })();
            return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [!this.tunnel && ((0, jsx_runtime_1.jsx)(SVG.path, { d: (0, lineUtils_1.linePath)(this), fill: "none", stroke: LINE_STROKE, strokeWidth: LINE_STROKE_WIDTH, strokeLinecap: "round" })), boostGlow] }, this.id));
        };
        this.renderTunnelDots = () => {
            if (!this.tunnel)
                return null;
            return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [(0, svgDot_1.svgDot)(this.start.x, this.start.y, "small"), (0, svgDot_1.svgDot)(this.end.x, this.end.y, "small")] }, `td-${this.id}`));
        };
        this.renderOverlay = (tokens, elapsed) => {
            if (!this.showSpeed && this.limitation === 0)
                return null;
            const OFFSET = 36;
            const W = 26, H = 18, RX = 3, AW = 4, AH = 5;
            const offsetMap = {
                right: [OFFSET, 0], left: [-OFFSET, 0], top: [0, -OFFSET], bottom: [0, OFFSET],
            };
            const arrowPoints = (pos, cx, cy) => {
                if (pos === "top")
                    return `${cx - AW},${cy + H / 2} ${cx + AW},${cy + H / 2} ${cx},${cy + H / 2 + AH}`;
                if (pos === "bottom")
                    return `${cx - AW},${cy - H / 2} ${cx + AW},${cy - H / 2} ${cx},${cy - H / 2 - AH}`;
                if (pos === "left")
                    return `${cx + W / 2},${cy - AW} ${cx + W / 2},${cy + AW} ${cx + W / 2 + AH},${cy}`;
                if (pos === "right")
                    return `${cx - W / 2},${cy - AW} ${cx - W / 2},${cy + AW} ${cx - W / 2 - AH},${cy}`;
                return "";
            };
            const { SPEED_FONT_SIZE, LIMIT_R } = LinePreview;
            const mid = lineMid(this);
            const isSpeeding = this.limitation > 0 && tokens.some((t) => t.type !== "cop" && t.currentSpeed > this.limitation);
            if (isSpeeding && !this.wasSpeeding)
                this.limitFlashStart = elapsed;
            this.wasSpeeding = isSpeeding;
            const flashOn = elapsed - this.limitFlashStart < 0.35;
            return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [this.showSpeed && tokens.filter((t) => t.type !== "cop").map((token) => {
                        const pt = this.points[token.pointIndex];
                        if (!pt)
                            return null;
                        const [ox, oy] = offsetMap[this.showSpeed] ?? [0, -OFFSET];
                        const cx = pt.x + ox;
                        const cy = pt.y + oy;
                        return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [(0, jsx_runtime_1.jsx)(SVG.rect, { x: cx - W / 2, y: cy - H / 2, width: W, height: H, rx: RX, fill: constants_2.COLOR_WHITE }), (0, jsx_runtime_1.jsx)(SVG.polygon, { points: arrowPoints(this.showSpeed, cx, cy), fill: constants_2.COLOR_WHITE }), (0, jsx_runtime_1.jsx)(SVG.text, { x: cx, y: cy, textAnchor: "middle", dominantBaseline: "middle", fontFamily: constants_2.GAME_FONT, fontSize: SPEED_FONT_SIZE, fontWeight: "bold", fill: constants_2.COLOR_DARK_GRAY, children: Math.round(token.currentSpeed) })] }, token.id));
                    }), this.limitation !== 0 && ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [(0, jsx_runtime_1.jsx)(SVG.circle, { cx: mid.x, cy: mid.y, r: LIMIT_R, fill: constants_2.COLOR_WHITE, stroke: flashOn ? constants_2.COLOR_RED : "#ccc", strokeWidth: 3 }), (0, jsx_runtime_1.jsx)(SVG.text, { x: mid.x, y: mid.y, textAnchor: "middle", dominantBaseline: "central", fontFamily: constants_2.GAME_FONT, fontSize: SPEED_FONT_SIZE, fontWeight: "bold", fill: constants_2.COLOR_DARK_GRAY, children: this.limitation })] }))] }, `ov-${this.id}`));
        };
    }
}
exports.LinePreview = LinePreview;
LinePreview.BOOST_WIN_PX = 80;
LinePreview.BOOST_ANIM_SPEED = 4;
LinePreview.BOOST_GLOW_COLOR = constants_2.COLOR_ORANGE_GLOW;
LinePreview.BOOST_STROKE_WIDTH = 3;
LinePreview.TUNNEL_DOT_R = 7;
LinePreview.LINE_STROKE = "#ccc";
LinePreview.LINE_STROKE_WIDTH = 6;
LinePreview.SPEED_BOX_W = 26;
LinePreview.SPEED_BOX_H = 19;
LinePreview.SPEED_BOX_RX = 4;
LinePreview.SPEED_FONT_SIZE = 12;
LinePreview.LIMIT_R = 15;
LinePreview.LIMIT_OFFSET_X = 24;
