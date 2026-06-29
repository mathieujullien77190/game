"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewManager = void 0;
const constants_1 = require("../constants");
const EXPLOSION_DURATION = 2;
const StartPreview_1 = require("../Start/StartPreview");
const SwitchPreview_1 = require("../Switch/SwitchPreview");
const TokenPreview_1 = require("../Token/TokenPreview");
const InverterPreview_1 = require("../Inverter/InverterPreview");
const TransformerPreview_1 = require("../Transformer/TransformerPreview");
const ScreenGatePreview_1 = require("../ScreenGate/ScreenGatePreview");
const ArrivalPreview_1 = require("../Arrival/ArrivalPreview");
const Manager_1 = require("./Manager");
const lerpHex = (a, b, t) => {
    const ar = parseInt(a.slice(1, 3), 16), ag = parseInt(a.slice(3, 5), 16), ab2 = parseInt(a.slice(5, 7), 16);
    const br = parseInt(b.slice(1, 3), 16), bg = parseInt(b.slice(3, 5), 16), bb2 = parseInt(b.slice(5, 7), 16);
    const r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), b3 = Math.round(ab2 + (bb2 - ab2) * t);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b3.toString(16).padStart(2, "0")}`;
};
class PreviewManager extends Manager_1.Manager {
    constructor() {
        super(...arguments);
        this.data = {
            lines: {},
            tokens: [],
            start: null,
            switches: {},
            switchLinks: {},
            links: {},
            linkMap: {},
            transformers: {},
            transformerByLinkId: {},
            linkByEndpointKey: {},
            inverters: {},
            inverterLinkMap: new Map(),
            screenEffects: {},
            screenGates: {},
            screenGateByLinkId: {},
            screenGateByExitKey: {},
            previewScreenId: "main",
            previewScreenHistory: [],
            screenTimeMultipliers: {},
            arrival: null,
            arrivalKey: "",
            _wonExploded: false,
            elapsedSeconds: 0,
            lastTimestamp: null,
        };
        this.initSimulation = (tokens, links, starts, switches = {}, switchLinks = {}, transformers = {}, arrival = null, inverters = {}, screenGates = {}, screenTimeMultipliers = {}) => {
            this.data.switchLinks = switchLinks;
            this.data.links = links;
            this.data.linkMap = {};
            this.data.elapsedSeconds = 0;
            this.data.lastTimestamp = null;
            this.data.linkByEndpointKey = {};
            for (const lk of Object.values(links)) {
                const k1 = `${lk.line1.lineId}::${lk.line1.endpoint}`;
                const k2 = `${lk.line2.lineId}::${lk.line2.endpoint}`;
                this.data.linkByEndpointKey[k1] = lk.id;
                this.data.linkByEndpointKey[k2] = lk.id;
                if (!lk.activated)
                    continue;
                this.data.linkMap[k1] = lk.line2;
                this.data.linkMap[k2] = lk.line1;
            }
            this.data.transformers = {};
            this.data.transformerByLinkId = {};
            for (const tr of Object.values(transformers)) {
                const tp = new TransformerPreview_1.TransformerPreview(tr.linkId, tr.type, tr.id, tr.amount, tr.color, tr.targetType);
                this.data.transformers[tp.id] = tp;
                this.data.transformerByLinkId[tr.linkId] = tp.id;
            }
            this.data.switches = {};
            for (const s of Object.values(switches)) {
                const sw = new SwitchPreview_1.SwitchPreview(s.id, s.linkIds, s.activeLinkId);
                if (s.color)
                    sw.color = s.color;
                if (s.activeLinkId) {
                    const idx = s.linkIds.indexOf(s.activeLinkId);
                    if (idx !== -1)
                        sw.activeIndex = idx;
                }
                sw.applyToLinkMap(links, this.data.linkMap);
                this.data.switches[s.id] = sw;
            }
            this.data.inverters = {};
            this.data.inverterLinkMap = new Map();
            this.data.screenEffects = {};
            for (const inv of Object.values(inverters)) {
                const ip = new InverterPreview_1.InverterPreview(inv.linkId, inv.id);
                ip.effect = inv.effect;
                this.data.inverters[inv.id] = ip;
                this.data.inverterLinkMap.set(inv.linkId, inv.effect);
            }
            this.data.screenGates = {};
            this.data.screenGateByLinkId = {};
            this.data.screenGateByExitKey = {};
            this.data.previewScreenId = "main";
            this.data.previewScreenHistory = [];
            this.data.screenTimeMultipliers = screenTimeMultipliers;
            for (const sg of Object.values(screenGates)) {
                const sgp = new ScreenGatePreview_1.ScreenGatePreview(sg.linkId, sg.targetScreenId, sg.entryKey, sg.exitKey, sg.id, sg.screenId);
                sgp.timeMultiplier = screenTimeMultipliers[sg.targetScreenId] ?? 1;
                this.data.screenGates[sgp.id] = sgp;
                this.data.screenGateByLinkId[sg.linkId] = sgp;
                if (sg.exitKey)
                    this.data.screenGateByExitKey[sg.exitKey] = sgp;
            }
            this.data.arrival = arrival ? new ArrivalPreview_1.ArrivalPreview(arrival.lineId, arrival.endpoint, arrival.id, arrival.demands) : null;
            this.data.arrivalKey = arrival ? `${arrival.lineId}::${arrival.endpoint}` : "";
            this.data._wonExploded = false;
            const s = Object.values(starts)[0];
            this.data.start = s ? new StartPreview_1.StartPreview(s.lineId, s.endpoint, s.delay, s.id) : null;
            this.data.tokens = [];
            if (this.data.start) {
                const start = this.data.start;
                const line = this.data.lines[start.lineId];
                if (line) {
                    const spawnIndex = start.endpoint === "end" ? line.points.length - 1 : 0;
                    const direction = start.endpoint === "end" ? -1 : 1;
                    this.data.tokens = Object.values(tokens).map((t, i) => {
                        const token = new TokenPreview_1.TokenPreview(t.color, t.speed, t.id, t.type);
                        token.startId = start.id;
                        token.lineId = start.lineId;
                        token.pointIndex = spawnIndex;
                        token.remainder = 0;
                        token.direction = direction;
                        token.startAt = i === 0 ? 2 : 2 + i * start.delay;
                        token.currentSpeed = 0;
                        token.baseSpeed = token.speed;
                        return token;
                    });
                }
            }
        };
        this.explodeAll = () => {
            for (const token of this.data.tokens) {
                if (!token.exploding && !token.arrived) {
                    token.exploding = true;
                    token.direction = 0;
                    token.explosionSeed = (Math.random() * 999999) | 0;
                }
            }
        };
        this.tickSim = (timestamp) => {
            if (this.data.lastTimestamp === null) {
                this.data.lastTimestamp = timestamp;
                return;
            }
            const deltaMs = Math.max(1, Math.min(timestamp - this.data.lastTimestamp, 100));
            this.data.lastTimestamp = timestamp;
            const deltaSeconds = deltaMs / 1000;
            this.data.elapsedSeconds += deltaSeconds;
            for (const sw of Object.values(this.data.switches))
                sw.tick(deltaSeconds);
            if (this.data.arrival) {
                const arr = this.data.arrival;
                const n = arr.demands.length;
                if (n > 0 && arr.correctCount >= n && !this._wonExploded) {
                    this._wonExploded = true;
                    this.explodeAll();
                }
                if (arr.flashColor && arr.flashProgress < 1) {
                    arr.flashProgress = Math.min(1, arr.flashProgress + deltaSeconds / 0.45);
                    if (arr.flashProgress >= 1)
                        arr.flashColor = null;
                }
                if (arr.arcFill !== arr.arcTarget) {
                    const speed = 3;
                    const dir = arr.arcTarget > arr.arcFill ? 1 : -1;
                    arr.arcFill += dir * deltaSeconds * speed;
                    if (dir > 0 && arr.arcFill > arr.arcTarget)
                        arr.arcFill = arr.arcTarget;
                    if (dir < 0 && arr.arcFill < arr.arcTarget)
                        arr.arcFill = arr.arcTarget;
                }
            }
            for (const token of this.data.tokens) {
                if (this.data.elapsedSeconds < token.startAt)
                    continue;
                if (token.isTransforming) {
                    token.transformProgress = Math.min(1, token.transformProgress + deltaSeconds / constants_1.PAINT_DURATION);
                    const activeTransformer = this.data.transformers[this.data.transformerByLinkId[token.transformingLinkId]];
                    if (activeTransformer) {
                        activeTransformer.transformProgress = token.transformProgress;
                        if (token.transformMode === "color") {
                            activeTransformer.currentTokenColor = token.displayColor || token.color;
                        }
                        if (token.transformMode === "fade") {
                            token.opacity = token.fadeOpacityFrom + (activeTransformer.amount - token.fadeOpacityFrom) * token.transformProgress;
                        }
                    }
                    if (token.transformProgress >= 1) {
                        token.isTransforming = false;
                        if (token.transformMode === "shape")
                            token.type = token.pendingType;
                        if (activeTransformer) {
                            activeTransformer.transformProgress = -1;
                            activeTransformer.currentTokenColor = "";
                        }
                        if (token.pendingLineId) {
                            token.lineId = token.pendingLineId;
                            token.pointIndex = token.pendingPointIndex;
                            token.direction = token.pendingDirection;
                            token.remainder = token.pendingRemainder;
                            token.pendingLineId = "";
                        }
                    }
                }
                else {
                    if (token.direction === 0 || token.speed === 0)
                        continue;
                    const line = this.data.lines[token.lineId];
                    if (!line)
                        continue;
                    const viewedMult = this.data.screenTimeMultipliers[this.data.previewScreenId] ?? 1;
                    const tokenScreenId = line.screenId ?? "main";
                    const tokenMult = this.data.screenTimeMultipliers[tokenScreenId] ?? 1;
                    const dt = deltaSeconds * (tokenMult / viewedMult);
                    const targetSpeed = line.boost !== 0 ? Math.max(1, token.speed + line.boost) : Math.max(1, token.speed);
                    const k = constants_1.ACCEL_TIME > 0 ? 1 - Math.exp(-dt / constants_1.ACCEL_TIME) : 1;
                    token.currentSpeed += (targetSpeed - token.currentSpeed) * k;
                    if (line.limitation > 0 && token.type !== "cop") {
                        if (token.currentSpeed > line.limitation) {
                            if (token.speedingLineId !== line.id) {
                                token.speedingLineId = line.id;
                                const copSpeed = targetSpeed * 1.1;
                                const cop = new TokenPreview_1.TokenPreview(constants_1.COLOR_TOKEN_RED, copSpeed);
                                cop.type = "cop";
                                cop.lineId = token.lineId;
                                cop.pointIndex = Math.max(0, Math.min(line.points.length - 1, token.pointIndex - token.direction * 20));
                                cop.direction = token.direction;
                                cop.remainder = token.remainder;
                                cop.currentSpeed = copSpeed;
                                cop.startAt = this.data.elapsedSeconds + 1.5;
                                this.data.tokens.push(cop);
                            }
                        }
                        else {
                            token.speedingLineId = "";
                        }
                    }
                    const result = token.advance(dt, line.points.length);
                    if (result) {
                        token.speedingLineId = "";
                        token.speed = token.currentSpeed;
                        token.transition(result.hit, result.excess, this.data);
                        for (const inv of Object.values(this.data.inverters)) {
                            const fx = this.data.screenEffects[inv.screenId];
                            if (!fx) {
                                inv.active = false;
                                continue;
                            }
                            if (inv.effect === "invert")
                                inv.active = fx.isInverted;
                            else if (inv.effect === "grayscale")
                                inv.active = fx.isGrayscale;
                            else if (inv.effect === "dark")
                                inv.active = fx.isDark;
                        }
                    }
                    if (token.rotationOffset !== token.targetRotationOffset) {
                        const diff = token.targetRotationOffset - token.rotationOffset;
                        const step = constants_1.ROTATION_SPEED * deltaSeconds;
                        token.rotationOffset = Math.abs(diff) <= step ? token.targetRotationOffset : token.rotationOffset + Math.sign(diff) * step;
                    }
                }
                if (token.colorProgress < 1) {
                    token.colorProgress = Math.min(1, token.colorProgress + deltaSeconds / constants_1.PAINT_DURATION);
                    token.displayColor = token.colorProgress >= 1 ? "" : lerpHex(token.colorTransitionFrom, token.color, token.colorProgress);
                }
            }
            if (this.data.tokens.some(t => t.arrived)) {
                this.data.tokens = this.data.tokens.filter(t => !t.arrived);
            }
            const active = this.data.tokens.filter(t => this.data.elapsedSeconds >= t.startAt && t.direction !== 0 && t.opacity >= 1);
            for (let i = 0; i < active.length; i++) {
                const lineA = this.data.lines[active[i].lineId];
                if (!lineA)
                    continue;
                const pa = lineA.points[active[i].pointIndex];
                if (!pa)
                    continue;
                for (let j = i + 1; j < active.length; j++) {
                    if (active[j].lineId !== active[i].lineId)
                        continue;
                    const pb = lineA.points[active[j].pointIndex];
                    if (!pb)
                        continue;
                    const dx = pa.x - pb.x, dy = pa.y - pb.y;
                    if (dx * dx + dy * dy < 16 * 16) {
                        active[i].exploding = true;
                        active[i].direction = 0;
                        active[i].explosionSeed = (Math.random() * 999999) | 0;
                        active[j].exploding = true;
                        active[j].direction = 0;
                        active[j].explosionSeed = (Math.random() * 999999) | 0;
                    }
                }
            }
            const FADE_DURATION = 8;
            for (const t of this.data.tokens) {
                if (!t.exploding)
                    continue;
                if (t.explosionProgress < 1) {
                    t.explosionProgress = Math.min(t.explosionProgress + deltaSeconds / EXPLOSION_DURATION, 1);
                }
                else {
                    t.explosionFadeProgress = Math.min(t.explosionFadeProgress + deltaSeconds / FADE_DURATION, 1);
                }
            }
            this.data.tokens = this.data.tokens.filter(t => !t.exploding || t.explosionFadeProgress < 1);
        };
        this.clickAt = (x, y) => {
            if (this.data.previewScreenHistory.length > 0) {
                const S = 0.1;
                const MW = constants_1.CANVAS_W * S;
                const MH = constants_1.CANVAS_H * S;
                const mx = constants_1.CANVAS_W - MW - 8;
                const my = constants_1.CANVAS_H - MH - 8;
                if (x >= mx && x <= mx + MW && y >= my && y <= my + MH) {
                    this.data.previewScreenId = this.data.previewScreenHistory.pop() ?? "main";
                    return;
                }
            }
            if (this.data.previewScreenId !== "main") {
                for (const sg of Object.values(this.data.screenGates)) {
                    if (sg.targetScreenId !== this.data.previewScreenId)
                        continue;
                    if (!sg.exitKey)
                        continue;
                    const [xLineId, xEp] = sg.exitKey.split("::");
                    const xLine = this.data.lines[xLineId];
                    if (!xLine)
                        continue;
                    const pt = xEp === "end" ? xLine.end : xLine.start;
                    if ((x - pt.x) ** 2 + (y - pt.y) ** 2 <= 12 ** 2) {
                        this.data.previewScreenId = this.data.previewScreenHistory.pop() ?? "main";
                        return;
                    }
                }
            }
            for (const sg of Object.values(this.data.screenGates)) {
                if (sg.screenId !== this.data.previewScreenId)
                    continue;
                if (!sg.targetScreenId)
                    continue;
                const link = this.data.links[sg.linkId];
                if (!link)
                    continue;
                const line = this.data.lines[link.line1.lineId];
                if (!line)
                    continue;
                const pt = link.line1.endpoint === "end" ? line.end : line.start;
                if (Math.abs(x - pt.x) <= 18 && Math.abs(y - pt.y) <= 32) {
                    this.data.previewScreenHistory.push(this.data.previewScreenId);
                    this.data.previewScreenId = sg.targetScreenId;
                    return;
                }
            }
            this.cycleSwitchAt(x, y);
        };
        this.cycleSwitchAt = (x, y) => {
            for (const sw of Object.values(this.data.switches)) {
                if (!sw.hitTest(x, y))
                    continue;
                const linked = this.data.switchLinks[sw.id] ?? [];
                const toCycle = [sw, ...linked.map((id) => this.data.switches[id]).filter(Boolean)];
                for (const s of toCycle) {
                    if (s.linkIds.length > 1) {
                        s.cycle();
                        s.applyToLinkMap(this.data.links, this.data.linkMap);
                    }
                }
                return;
            }
        };
    }
}
exports.PreviewManager = PreviewManager;
