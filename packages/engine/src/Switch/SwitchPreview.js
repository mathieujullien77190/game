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
exports.SwitchPreview = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SVG = __importStar(require("../svgElements"));
const Switch_1 = require("./Switch");
const switchUtils_1 = require("./switchUtils");
const svgDot_1 = require("../svgDot");
const animateAngle = (current, target, speed, dt) => {
    let delta = target - current;
    while (delta > Math.PI)
        delta -= 2 * Math.PI;
    while (delta < -Math.PI)
        delta += 2 * Math.PI;
    if (Math.abs(delta) < SwitchPreview.ANGLE_SNAP_THRESHOLD)
        return target;
    return current + delta * speed * dt;
};
class SwitchPreview extends Switch_1.Switch {
    constructor() {
        super(...arguments);
        this.activeIndex = 0;
        this.pulseTimer = 0;
        this.displayAngle = undefined;
        this.targetAngle = undefined;
        this._pt = null;
        this._enterAngle = undefined;
        this._allExitAngles = [];
        this.getActiveLinkId = () => this.linkIds[this.activeIndex] ?? null;
        this.cycle = () => {
            if (this.linkIds.length <= 1)
                return;
            this.activeIndex = (this.activeIndex + 1) % this.linkIds.length;
            this.activeLinkId = this.linkIds[this.activeIndex];
            this.pulseTimer = SwitchPreview.PULSE_DURATION;
        };
        this.setTargetAngle = (angle) => {
            if (angle === undefined) {
                this.targetAngle = undefined;
                this.displayAngle = undefined;
                return;
            }
            if (this.displayAngle === undefined)
                this.displayAngle = angle;
            this.targetAngle = angle;
        };
        this.tick = (deltaSeconds) => {
            if (this.pulseTimer > 0)
                this.pulseTimer = Math.max(0, this.pulseTimer - deltaSeconds);
            if (this.displayAngle !== undefined && this.targetAngle !== undefined) {
                this.displayAngle = animateAngle(this.displayAngle, this.targetAngle, SwitchPreview.ARM_ANGLE_SPEED, deltaSeconds);
            }
        };
        this.prepareFrame = (lines, links, linkMap) => {
            const { RADIUS } = SwitchPreview;
            const ep = (0, switchUtils_1.getSwitchEnterPoint)(this.linkIds, links);
            if (!ep) {
                this._pt = null;
                return;
            }
            const line = lines[ep.lineId];
            if (!line) {
                this._pt = null;
                return;
            }
            const pt = ep.endpoint === "end"
                ? line.points[line.points.length - 1]
                : line.points[0];
            if (!pt) {
                this._pt = null;
                return;
            }
            this._pt = pt;
            this._enterAngle =
                (0, switchUtils_1.curveIntersectAngle)(line.points, ep.endpoint, pt.x, pt.y, RADIUS) ??
                    (ep.endpoint === "end" ? pt.angle + Math.PI : pt.angle);
            this._allExitAngles = this.linkIds.flatMap((lid) => {
                const link = links[lid];
                if (!link)
                    return [];
                const dest = (link.line1.lineId === ep.lineId && link.line1.endpoint === ep.endpoint) ? link.line2 : link.line1;
                const destLine = lines[dest.lineId];
                if (!destLine || destLine.points.length === 0)
                    return [];
                const angle = (0, switchUtils_1.curveIntersectAngle)(destLine.points, dest.endpoint, pt.x, pt.y, RADIUS)
                    ?? (dest.endpoint === "end" ? destLine.points[destLine.points.length - 1].angle + Math.PI : destLine.points[0].angle);
                return [angle];
            });
            const activeDest = linkMap[`${ep.lineId}::${ep.endpoint}`];
            if (activeDest) {
                const destLine = lines[activeDest.lineId];
                if (destLine && destLine.points.length > 0) {
                    const activeAngle = (0, switchUtils_1.curveIntersectAngle)(destLine.points, activeDest.endpoint, pt.x, pt.y, RADIUS) ??
                        (activeDest.endpoint === "end"
                            ? destLine.points[destLine.points.length - 1].angle + Math.PI
                            : destLine.points[0].angle);
                    this.setTargetAngle(activeAngle);
                }
            }
        };
        this.applyToLinkMap = (links, linkMap) => {
            const ep = (0, switchUtils_1.getSwitchEnterPoint)(this.linkIds, links);
            if (!ep)
                return;
            const activeLinkId = this.getActiveLinkId();
            if (!activeLinkId)
                return;
            const link = links[activeLinkId];
            if (!link)
                return;
            const key = `${ep.lineId}::${ep.endpoint}`;
            linkMap[key] =
                link.line1.lineId === ep.lineId && link.line1.endpoint === ep.endpoint
                    ? link.line2
                    : link.line1;
        };
        this.getPoint = () => this._pt;
        this.hitTest = (x, y) => {
            if (!this._pt)
                return false;
            const dx = x - this._pt.x;
            const dy = y - this._pt.y;
            const { HIT_RADIUS } = SwitchPreview;
            return dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS;
        };
        this.render = (lines, links, linkMap) => {
            this.prepareFrame(lines, links, linkMap);
            const pt = this.getPoint();
            if (!pt)
                return null;
            const { RADIUS: r, PULSE_DURATION, PULSE_EXPAND_R, ARM_STROKE_WIDTH, STROKE_WIDTH, } = SwitchPreview;
            const enterAngle = this._enterAngle;
            const displayAngle = this.displayAngle;
            return ((0, jsx_runtime_1.jsxs)(SVG.g, { children: [this.pulseTimer > 0 && (() => {
                        const t = 1 - this.pulseTimer / PULSE_DURATION;
                        return ((0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: r + t * PULSE_EXPAND_R, fill: "none", stroke: "#ccc", strokeWidth: STROKE_WIDTH, opacity: 1 - t }));
                    })(), (0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: r, fill: "#f5f5f7" }), this._allExitAngles.map((angle, i) => ((0, jsx_runtime_1.jsx)(SVG.g, { children: (0, svgDot_1.svgDot)(pt.x + Math.cos(angle) * r, pt.y + Math.sin(angle) * r, "small") }, i))), enterAngle !== undefined && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(SVG.line, { x1: pt.x, y1: pt.y, x2: pt.x + Math.cos(enterAngle) * r, y2: pt.y + Math.sin(enterAngle) * r, stroke: "#ccc", strokeWidth: ARM_STROKE_WIDTH, strokeLinecap: "round" }), (0, svgDot_1.svgDot)(pt.x + Math.cos(enterAngle) * r, pt.y + Math.sin(enterAngle) * r, "big", this.color)] })), displayAngle !== undefined && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(SVG.line, { x1: pt.x, y1: pt.y, x2: pt.x + Math.cos(displayAngle) * r, y2: pt.y + Math.sin(displayAngle) * r, stroke: "#ccc", strokeWidth: ARM_STROKE_WIDTH, strokeLinecap: "round" }), (0, svgDot_1.svgDot)(pt.x + Math.cos(displayAngle) * r, pt.y + Math.sin(displayAngle) * r, "big", this.color)] })), (0, jsx_runtime_1.jsx)(SVG.circle, { cx: pt.x, cy: pt.y, r: 5, fill: this.color })] }, this.id));
        };
    }
}
exports.SwitchPreview = SwitchPreview;
SwitchPreview.RADIUS = 24;
SwitchPreview.HIT_RADIUS = 36;
SwitchPreview.ANGLE_SNAP_THRESHOLD = 0.005;
SwitchPreview.PULSE_DURATION = 0.3;
SwitchPreview.ARM_ANGLE_SPEED = 8;
SwitchPreview.PULSE_EXPAND_R = 12;
SwitchPreview.ARM_STROKE_WIDTH = 4;
SwitchPreview.ARM_DOT_R = 7;
SwitchPreview.STROKE_WIDTH = 3;
