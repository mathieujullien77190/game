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
exports.TokenPreview = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SVG = __importStar(require("../svgElements"));
const constants_1 = require("../constants");
const Token_1 = require("./Token");
const utils_1 = require("../utils");
const tokenShape = (data, x, y, angle) => {
    const { BASE_R, SQUARE_HALF_BASE, SQUARE_RX, PULSE_SPEED, PULSE_AMPLITUDE, } = TokenPreview;
    const phase = (parseInt(data.id.replace(/\D/g, "") || "0") * 1.7) % (Math.PI * 2);
    const pulse = 1 + Math.sin(Date.now() / PULSE_SPEED + phase) * PULSE_AMPLITUDE;
    const color = data.displayColor || data.color;
    const rot = (data.direction === -1 ? angle + Math.PI : angle) + data.rotationOffset;
    const moving = data.direction !== 0 && data.currentSpeed > 0;
    if (data.type === "cop") {
        const { COP_FLASH_SPEED, COP_COLOR_A, COP_COLOR_B } = TokenPreview;
        const flash = Math.sin((Date.now() / 1000) * Math.PI * COP_FLASH_SPEED) > 0;
        const copColor = flash ? COP_COLOR_A : COP_COLOR_B;
        const r = BASE_R / 1.6;
        return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [(0, jsx_runtime_1.jsx)(SVG.circle, { cx: x, cy: y, r: r * 1.8, fill: copColor, opacity: 0.1 }), (0, jsx_runtime_1.jsx)(SVG.circle, { cx: x, cy: y, r: r, fill: copColor })] }));
    }
    if (data.type === "square") {
        const hw = SQUARE_HALF_BASE * pulse;
        const hwBig = SQUARE_HALF_BASE * 1.8;
        const tf = `rotate(${(rot * 180) / Math.PI},${x},${y})`;
        return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [moving && (0, jsx_runtime_1.jsx)(SVG.rect, { x: x - hwBig, y: y - hwBig, width: hwBig * 2, height: hwBig * 2, rx: SQUARE_RX * 1.8, fill: color, opacity: 0.1, transform: tf }), (0, jsx_runtime_1.jsx)(SVG.rect, { x: x - hw, y: y - hw, width: hw * 2, height: hw * 2, rx: SQUARE_RX, fill: color, transform: tf })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [moving && (0, jsx_runtime_1.jsx)(SVG.circle, { cx: x, cy: y, r: BASE_R * 1.8, fill: color, opacity: 0.1 }), (0, jsx_runtime_1.jsx)(SVG.circle, { cx: x, cy: y, r: BASE_R * pulse, fill: color })] }));
};
const tokenTrail = (token, line) => {
    const { TRAIL_SPEED_THRESHOLD, TRAIL_BASE_LEN, TRAIL_SPEED_LEN, TRAIL_SIZE_RATIO, TRAIL_OPACITY, BASE_R, } = TokenPreview;
    const speedDelta = token.currentSpeed - token.speed;
    if (speedDelta <= TRAIL_SPEED_THRESHOLD ||
        token.direction === 0 ||
        line.boost === 0)
        return null;
    const intensity = Math.min(speedDelta / 100, 1);
    const trailLen = Math.round(TRAIL_BASE_LEN + TRAIL_SPEED_LEN * intensity);
    const color = token.displayColor || token.color;
    const pieces = [];
    for (let i = 1; i <= trailLen; i++) {
        const idx = token.pointIndex - token.direction * i;
        if (idx < 0 || idx >= line.points.length)
            break;
        const tpt = line.points[idx];
        const frac = 1 - i / (trailLen + 1);
        pieces.push((0, jsx_runtime_1.jsx)(SVG.circle, { cx: tpt.x, cy: tpt.y, r: BASE_R * frac * TRAIL_SIZE_RATIO, fill: color, opacity: frac * TRAIL_OPACITY }, i));
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: pieces });
};
const tokenExplosion = (token, x, y) => {
    const { EXPLOSION_PIECE_COUNT, EXPLOSION_SPEED_MIN, EXPLOSION_SPEED_RANGE, EXPLOSION_SIZE_MIN, EXPLOSION_SIZE_RANGE, } = TokenPreview;
    const progress = token.explosionProgress;
    const fade = 1 - token.explosionFadeProgress;
    const color = token.displayColor || token.color;
    const seed = token.explosionSeed;
    const isSquare = token.type === "square";
    const f = 1 - Math.pow(1 - progress, 4);
    const pieces = [];
    for (let k = 0; k < EXPLOSION_PIECE_COUNT; k++) {
        const angle = (0, utils_1.rng)(seed, k) * Math.PI * 2;
        const speed = EXPLOSION_SPEED_MIN + (0, utils_1.rng)(seed, k + 10) * EXPLOSION_SPEED_RANGE;
        const size = EXPLOSION_SIZE_MIN + (0, utils_1.rng)(seed, k + 20) * EXPLOSION_SIZE_RANGE;
        const target = 0.2 + (0, utils_1.rng)(seed, k + 25) * 0.8;
        const alpha = (1 - progress * (1 - target)) * fade;
        const px = x + Math.cos(angle) * f * speed;
        const py = y + Math.sin(angle) * f * speed;
        if (isSquare) {
            const rotDir = (0, utils_1.rng)(seed, k + 40) > 0.5 ? 1 : -1;
            const rotSpeed = 90 + (0, utils_1.rng)(seed, k + 45) * 180;
            const deg = rotDir * progress * rotSpeed;
            pieces.push((0, jsx_runtime_1.jsx)(SVG.rect, { x: px - size, y: py - size, width: size * 2, height: size * 2, fill: color, opacity: alpha, transform: `rotate(${deg.toFixed(1)},${px.toFixed(1)},${py.toFixed(1)})` }, `s${k}`));
        }
        else {
            pieces.push((0, jsx_runtime_1.jsx)(SVG.circle, { cx: px, cy: py, r: size, fill: color, opacity: alpha }, `c${k}`));
        }
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: pieces });
};
class TokenPreview extends Token_1.Token {
    constructor() {
        super(...arguments);
        // explosion — border pieces (arcs for round, lines for square)
        this.startId = "";
        this.lineId = "";
        this.pointIndex = 0;
        this.remainder = 0;
        this.direction = 1;
        this.startAt = 0;
        this.currentSpeed = 0;
        this.baseSpeed = 0;
        this.rotationOffset = 0;
        this.targetRotationOffset = 0;
        this.colorTransitionFrom = "";
        this.displayColor = "";
        this.colorProgress = 1;
        this.opacity = 1;
        this.arrived = false;
        this.isTransforming = false;
        this.transformProgress = 0;
        this.transformingLinkId = "";
        this.transformMode = "shape";
        this.fadeOpacityFrom = 1;
        this.pendingType = "round";
        this.pendingLineId = "";
        this.pendingPointIndex = 0;
        this.pendingDirection = 1;
        this.pendingRemainder = 0;
        this.portalContext = null;
        this.speedingLineId = "";
        this.exploding = false;
        this.explosionProgress = 0;
        this.explosionFadeProgress = 0;
        this.explosionSeed = 0;
        this.transition = (arrivedAt, excess, ctx) => {
            const screenId = ctx.lines[this.lineId]?.screenId ?? "main";
            if (!ctx.screenEffects[screenId])
                ctx.screenEffects[screenId] = { isInverted: false, isGrayscale: false, isDark: false };
            let isInverted = ctx.screenEffects[screenId].isInverted;
            let isGrayscale = ctx.screenEffects[screenId].isGrayscale;
            let isDark = ctx.screenEffects[screenId].isDark;
            if (this.portalContext) {
                const exitGate = ctx.screenGateByExitKey[`${this.lineId}::${arrivedAt}`];
                if (exitGate) {
                    this.lineId = this.portalContext.returnLineId;
                    this.pointIndex = this.portalContext.returnPointIndex;
                    this.direction = this.portalContext.returnDirection;
                    this.remainder = this.portalContext.returnRemainder;
                    this.portalContext = null;
                    return { isInverted, isGrayscale, isDark };
                }
            }
            if (ctx.arrivalKey && ctx.arrivalKey === `${this.lineId}::${arrivedAt}`) {
                if (ctx.arrival && this.type !== "cop") {
                    const demand = ctx.arrival.demands[ctx.arrival.currentDemandIndex];
                    const tokenColor = this.displayColor || this.color;
                    const correct = demand ? demand.color === tokenColor && demand.type === this.type : false;
                    const n = ctx.arrival.demands.length;
                    ctx.arrival.flashColor = correct ? "#2E9E6B" : "#FF5630";
                    ctx.arrival.flashProgress = 0;
                    if (correct) {
                        ctx.arrival.currentDemandIndex++;
                        ctx.arrival.correctCount++;
                        ctx.arrival.arcTarget = Math.min(n, ctx.arrival.arcTarget + 1);
                    }
                }
                this.arrived = true;
                this.direction = 0;
                return { isInverted, isGrayscale, isDark };
            }
            const linkId = ctx.linkByEndpointKey[`${this.lineId}::${arrivedAt}`];
            const transformer = linkId
                ? ctx.transformers[ctx.transformerByLinkId[linkId]]
                : undefined;
            if (transformer?.type === "rotate")
                this.targetRotationOffset += Math.PI * 2.25;
            if (transformer?.type === "fade") {
                if (Math.abs(this.opacity - transformer.amount) < 0.01) {
                    this.opacity = transformer.amount;
                    transformer.transformProgress = -1;
                }
                else {
                    this.fadeOpacityFrom = this.opacity;
                    this.isTransforming = true;
                    this.transformProgress = 0;
                    this.transformingLinkId = linkId;
                    this.transformMode = "fade";
                    this.direction = 0;
                    this.currentSpeed = this.speed;
                    transformer.transformProgress = 0;
                }
            }
            const inverterEffect = linkId ? ctx.inverterLinkMap.get(linkId) : undefined;
            if (inverterEffect === "invert")
                isInverted = !isInverted;
            else if (inverterEffect === "grayscale")
                isGrayscale = !isGrayscale;
            else if (inverterEffect === "dark")
                isDark = !isDark;
            if (inverterEffect)
                ctx.screenEffects[screenId] = { isInverted, isGrayscale, isDark };
            const screenGate = linkId ? ctx.screenGateByLinkId[linkId] : undefined;
            if (screenGate) {
                const other = ctx.linkMap[`${this.lineId}::${arrivedAt}`];
                if (other) {
                    const returnLine = ctx.lines[other.lineId];
                    this.portalContext = {
                        returnLineId: other.lineId,
                        returnPointIndex: other.endpoint === "start"
                            ? 0
                            : (returnLine?.points.length ?? 1) - 1,
                        returnDirection: other.endpoint === "start" ? 1 : -1,
                        returnRemainder: excess,
                    };
                }
                const [entryLineId, entryEndpoint] = screenGate.entryKey.split("::");
                const entryLine = ctx.lines[entryLineId];
                if (entryLine) {
                    this.lineId = entryLineId;
                    this.pointIndex =
                        entryEndpoint === "start" ? 0 : entryLine.points.length - 1;
                    this.direction = entryEndpoint === "start" ? 1 : -1;
                    this.remainder = excess;
                }
                return { isInverted, isGrayscale, isDark };
            }
            if (transformer?.type === "color" || transformer?.type === "shape") {
                const currentColor = this.displayColor || this.color;
                const needsColor = transformer.type === "color" && currentColor !== transformer.color;
                const needsShape = transformer.type === "shape" &&
                    this.type !== transformer.targetType;
                if (needsColor || needsShape) {
                    this.isTransforming = true;
                    this.transformProgress = 0;
                    this.transformingLinkId = linkId;
                    this.transformMode = transformer.type;
                    this.direction = 0;
                    this.currentSpeed = this.speed;
                    transformer.transformProgress = 0;
                    if (needsColor) {
                        this.colorTransitionFrom = currentColor;
                        this.color = transformer.color;
                        this.colorProgress = 0;
                    }
                    if (needsShape) {
                        this.pendingType = transformer.targetType;
                    }
                    const other = ctx.linkMap[`${this.lineId}::${arrivedAt}`];
                    if (other) {
                        const newLine = ctx.lines[other.lineId];
                        this.pendingLineId = other.lineId;
                        this.pendingPointIndex =
                            other.endpoint === "start" ? 0 : (newLine?.points.length ?? 1) - 1;
                        this.pendingDirection = other.endpoint === "start" ? 1 : -1;
                        this.pendingRemainder = excess;
                    }
                    else {
                        const line = ctx.lines[this.lineId];
                        this.pointIndex =
                            arrivedAt === "end" ? (line?.points.length ?? 1) - 1 : 0;
                        this.remainder = 0;
                        this.pendingLineId = "";
                    }
                    return { isInverted, isGrayscale, isDark };
                }
            }
            const other = ctx.linkMap[`${this.lineId}::${arrivedAt}`];
            if (other) {
                this.lineId = other.lineId;
                const newLine = ctx.lines[this.lineId];
                this.pointIndex =
                    other.endpoint === "start" ? 0 : (newLine?.points.length ?? 1) - 1;
                this.direction = other.endpoint === "start" ? 1 : -1;
                this.remainder = excess;
            }
            else {
                this.arrived = true;
                this.direction = 0;
            }
            return { isInverted, isGrayscale, isDark };
        };
        this.advance = (deltaSeconds, pointCount) => {
            let budget = Math.max(1, this.currentSpeed) * deltaSeconds + this.remainder;
            const maxIndex = pointCount - 1;
            while (budget >= constants_1.POINT_SPACING) {
                budget -= constants_1.POINT_SPACING;
                const next = this.pointIndex + this.direction;
                if (next > maxIndex)
                    return { hit: "end", excess: budget };
                if (next < 0)
                    return { hit: "start", excess: budget };
                this.pointIndex = next;
            }
            this.remainder = budget;
            return null;
        };
        this.renderShape = (x, y, angle) => tokenShape(this, x, y, angle);
        this.render = (pt, line) => {
            if (this.exploding) {
                return (0, jsx_runtime_1.jsx)(SVG.g, { children: tokenExplosion(this, pt.x, pt.y) }, this.id);
            }
            const isShapeTransforming = this.isTransforming &&
                this.transformProgress > 0 &&
                this.transformMode === "shape";
            return ((0, jsx_runtime_1.jsxs)(SVG.g, { opacity: this.opacity, children: [tokenTrail(this, line), isShapeTransforming ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(SVG.g, { opacity: 1 - this.transformProgress, children: tokenShape(this, pt.x, pt.y, pt.angle) }), (0, jsx_runtime_1.jsx)(SVG.g, { opacity: this.transformProgress, children: tokenShape({ ...this, type: this.pendingType }, pt.x, pt.y, pt.angle) })] })) : (tokenShape(this, pt.x, pt.y, pt.angle))] }, this.id));
        };
    }
}
exports.TokenPreview = TokenPreview;
// pulse animation
TokenPreview.PULSE_SPEED = 700;
TokenPreview.PULSE_AMPLITUDE = 0.13;
// cop token
TokenPreview.COP_FLASH_SPEED = 4;
TokenPreview.COP_COLOR_A = constants_1.COLOR_RED;
TokenPreview.COP_COLOR_B = constants_1.COLOR_BLUE;
// base shape
TokenPreview.BASE_R = 9;
TokenPreview.SQUARE_HALF_BASE = 9;
TokenPreview.SQUARE_RX = 3;
TokenPreview.STROKE_WIDTH = 2;
// trail
TokenPreview.TRAIL_SPEED_THRESHOLD = 0.5;
TokenPreview.TRAIL_BASE_LEN = 10;
TokenPreview.TRAIL_SPEED_LEN = 30;
TokenPreview.TRAIL_SIZE_RATIO = 0.75;
TokenPreview.TRAIL_OPACITY = 0.55;
// explosion — fill pieces
TokenPreview.EXPLOSION_PIECE_COUNT = 8;
TokenPreview.EXPLOSION_SPEED_MIN = 30;
TokenPreview.EXPLOSION_SPEED_RANGE = 70;
TokenPreview.EXPLOSION_SIZE_MIN = 2;
TokenPreview.EXPLOSION_SIZE_RANGE = 4;
