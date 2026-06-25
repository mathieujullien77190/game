import { ACCEL_TIME, PAINT_DURATION, ROTATION_SPEED } from "../constants";
import { LinePreview } from "../Line/LinePreview";
import type { Link, LinkEndpoint } from "../Link/Link";
import type { Start } from "../Start/Start";
import { StartPreview } from "../Start/StartPreview";
import type { Switch } from "../Switch/Switch";
import { SwitchPreview } from "../Switch/SwitchPreview";
import { drawStats, smoothFps } from "../stats";
import type { Token } from "../Token/Token";
import { TokenPreview } from "../Token/TokenPreview";
import type { Inverter } from "../Inverter/Inverter";
import { InverterPreview } from "../Inverter/InverterPreview";
import type { Transformer } from "../Transformer/Transformer";
import { TransformerPreview } from "../Transformer/TransformerPreview";
import type { ScreenGate } from "../ScreenGate/ScreenGate";
import { ScreenGatePreview } from "../ScreenGate/ScreenGatePreview";
import type { Arrival } from "../Arrival/Arrival";
import { ArrivalPreview } from "../Arrival/ArrivalPreview";
import { Manager } from "./Manager";

const lerpHex = (a: string, b: string, t: number): string => {
  const ar = parseInt(a.slice(1, 3), 16), ag = parseInt(a.slice(3, 5), 16), ab2 = parseInt(a.slice(5, 7), 16)
  const br = parseInt(b.slice(1, 3), 16), bg = parseInt(b.slice(3, 5), 16), bb2 = parseInt(b.slice(5, 7), 16)
  const r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), b3 = Math.round(ab2 + (bb2 - ab2) * t)
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b3.toString(16).padStart(2, "0")}`
}

type LinkMap = Record<string, LinkEndpoint>;

export class PreviewManager extends Manager<LinePreview> {
  data = {
    lines: {} as Record<string, LinePreview>,
    tokens: [] as TokenPreview[],
    start: null as StartPreview | null,
    switches: {} as Record<string, SwitchPreview>,
    switchLinks: {} as Record<string, string[]>,
    links: {} as Record<string, Link>,
    linkMap: {} as LinkMap,
    transformers: {} as Record<string, TransformerPreview>,
    transformerByLinkId: {} as Record<string, string>,
    linkByEndpointKey: {} as Record<string, string>,
    inverters: {} as Record<string, InverterPreview>,
    inverterLinkIds: new Set<string>(),
    isInverted: false,
    screenGates: {} as Record<string, ScreenGatePreview>,
    screenGateByLinkId: {} as Record<string, ScreenGatePreview>,
    screenGateByExitKey: {} as Record<string, ScreenGatePreview>,
    previewScreenId: "main" as string,
    previewScreenHistory: [] as string[],
    arrival: null as ArrivalPreview | null,
    arrivalKey: "" as string,
    elapsedSeconds: 0,
    lastTimestamp: null as number | null,
    fps: 0,
    frameMs: 0,
  };

  initSimulation = (
    tokens: Record<string, Token>,
    links: Record<string, Link>,
    starts: Record<string, Start>,
    switches: Record<string, Switch> = {},
    switchLinks: Record<string, string[]> = {},
    transformers: Record<string, Transformer> = {},
    arrival: Arrival | null = null,
    inverters: Record<string, Inverter> = {},
    screenGates: Record<string, ScreenGate> = {},
  ) => {
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
      if (!lk.activated) continue;
      this.data.linkMap[k1] = lk.line2;
      this.data.linkMap[k2] = lk.line1;
    }

    this.data.transformers = {};
    this.data.transformerByLinkId = {};
    for (const tr of Object.values(transformers)) {
      const tp = new TransformerPreview(tr.linkId, tr.type, tr.id, tr.amount, tr.color, tr.targetType);
      this.data.transformers[tp.id] = tp;
      this.data.transformerByLinkId[tr.linkId] = tp.id;
    }

    this.data.switches = {};
    for (const s of Object.values(switches)) {
      const sw = new SwitchPreview(s.id, s.linkIds, s.activeLinkId);
      if (s.activeLinkId) {
        const idx = s.linkIds.indexOf(s.activeLinkId);
        if (idx !== -1) sw.activeIndex = idx;
      }
      sw.applyToLinkMap(links, this.data.linkMap);
      this.data.switches[s.id] = sw;
    }

    this.data.inverters = {};
    this.data.inverterLinkIds = new Set();
    this.data.isInverted = false;
    for (const inv of Object.values(inverters)) {
      this.data.inverters[inv.id] = new InverterPreview(inv.linkId, inv.id);
      this.data.inverterLinkIds.add(inv.linkId);
    }

    this.data.screenGates = {};
    this.data.screenGateByLinkId = {};
    this.data.screenGateByExitKey = {};
    this.data.previewScreenId = "main";
    this.data.previewScreenHistory = [];
    for (const sg of Object.values(screenGates)) {
      const sgp = new ScreenGatePreview(sg.linkId, sg.targetScreenId, sg.entryKey, sg.exitKey, sg.id, sg.screenId);
      this.data.screenGates[sgp.id] = sgp;
      this.data.screenGateByLinkId[sg.linkId] = sgp;
      if (sg.exitKey) this.data.screenGateByExitKey[sg.exitKey] = sgp;
    }

    this.data.arrival = arrival ? new ArrivalPreview(arrival.lineId, arrival.endpoint, arrival.id, arrival.demands) : null;
    this.data.arrivalKey = arrival ? `${arrival.lineId}::${arrival.endpoint}` : "";

    const s = Object.values(starts)[0];
    this.data.start = s ? new StartPreview(s.lineId, s.endpoint, s.delay, s.id) : null;

    this.data.tokens = [];
    if (this.data.start) {
      const start = this.data.start;
      const line = this.data.lines[start.lineId];
      if (line) {
        const spawnIndex = start.endpoint === "end" ? line.points.length - 1 : 0;
        const direction: 1 | -1 = start.endpoint === "end" ? -1 : 1;
        this.data.tokens = Object.values(tokens).map((t, i) => {
          const token = new TokenPreview(t.color, t.speed, t.id, t.type);
          token.startId = start.id;
          token.lineId = start.lineId;
          token.pointIndex = spawnIndex;
          token.remainder = 0;
          token.direction = direction;
          token.startAt = (i + 1) * start.delay;
          token.currentSpeed = 0;
          return token;
        });
      }
    }
  };

  tickSim = (timestamp: number) => {
    if (this.data.lastTimestamp === null) {
      this.data.lastTimestamp = timestamp;
      return;
    }
    const deltaMs = Math.max(1, Math.min(timestamp - this.data.lastTimestamp, 100));
    this.data.lastTimestamp = timestamp;
    this.data.fps = smoothFps(this.data.fps, deltaMs);

    const deltaSeconds = deltaMs / 1000;
    this.data.elapsedSeconds += deltaSeconds;

    for (const sw of Object.values(this.data.switches)) sw.tick(deltaSeconds);

    if (this.data.arrival?.isFading) {
      this.data.arrival.fadeAlpha = Math.max(0, this.data.arrival.fadeAlpha - deltaSeconds / 2);
      if (this.data.arrival.fadeAlpha <= 0) {
        this.data.arrival.isFading = false;
        this.data.arrival.fadeAlpha = 1;
        this.data.arrival.currentDemandIndex++;
      }
    }

    for (const token of this.data.tokens) {
      if (this.data.elapsedSeconds < token.startAt) continue;

      if (token.isTransforming) {
        token.transformProgress = Math.min(1, token.transformProgress + deltaSeconds / PAINT_DURATION);
        const activeTransformer = this.data.transformers[this.data.transformerByLinkId[token.transformingLinkId]];
        if (activeTransformer) {
          activeTransformer.transformProgress = token.transformProgress;
          if (token.transformMode === "color") {
            activeTransformer.currentTokenColor = token.displayColor || (token.color as string);
          }
        }
        if (token.transformProgress >= 1) {
          token.isTransforming = false;
          if (token.transformMode === "shape") token.type = token.pendingType as any;
          if (activeTransformer) { activeTransformer.transformProgress = -1; activeTransformer.currentTokenColor = ""; }
          if (token.pendingLineId) {
            token.lineId = token.pendingLineId;
            token.pointIndex = token.pendingPointIndex;
            token.direction = token.pendingDirection;
            token.remainder = token.pendingRemainder;
            token.pendingLineId = "";
          }
        }
      } else {
        if (token.direction === 0 || token.speed === 0) continue;
        const line = this.data.lines[token.lineId];
        if (!line) continue;
        const targetSpeed = line.boost !== 0 ? Math.max(1, line.boost) : Math.max(1, token.speed);
        const k = ACCEL_TIME > 0 ? 1 - Math.exp(-deltaSeconds / ACCEL_TIME) : 1;
        token.currentSpeed += (targetSpeed - token.currentSpeed) * k;
        const result = token.advance(deltaSeconds, line.points.length);
        if (result) {
          const { isInverted } = token.transition(result.hit, result.excess, this.data);
          this.data.isInverted = isInverted;
        }

        if (token.rotationOffset !== token.targetRotationOffset) {
          const diff = token.targetRotationOffset - token.rotationOffset;
          const step = ROTATION_SPEED * deltaSeconds;
          token.rotationOffset = Math.abs(diff) <= step ? token.targetRotationOffset : token.rotationOffset + Math.sign(diff) * step;
        }
      }

      if (token.colorProgress < 1) {
        token.colorProgress = Math.min(1, token.colorProgress + deltaSeconds / PAINT_DURATION);
        token.displayColor = token.colorProgress >= 1 ? "" : lerpHex(token.colorTransitionFrom, token.color as string, token.colorProgress);
      }
    }
    if (this.data.tokens.some(t => t.arrived)) {
      this.data.tokens = this.data.tokens.filter(t => !t.arrived);
    }
  };

  drawAllPreview = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();

    const sid = this.data.previewScreenId;
    const visibleLines = Object.values(this.data.lines).filter((l) => l.screenId === sid);

    this.drawSwitchLinks(ctx);
    for (const line of visibleLines) line.drawGlow(ctx, this.data.elapsedSeconds);
    for (const line of visibleLines) line.draw(ctx);

    for (const sg of Object.values(this.data.screenGates)) {
      if (sg.targetScreenId !== sid) continue;
      if (sg.entryKey) {
        const [eLineId, eEp] = sg.entryKey.split("::");
        const eLine = this.data.lines[eLineId];
        if (eLine) {
          const pt = eEp === "end" ? eLine.end : eLine.start;
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (sg.exitKey) {
        const [xLineId, xEp] = sg.exitKey.split("::");
        const xLine = this.data.lines[xLineId];
        if (xLine) {
          const pt = xEp === "end" ? xLine.end : xLine.start;
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    for (const sw of Object.values(this.data.switches)) {
      sw.prepareFrame(this.data.lines, this.data.links, this.data.linkMap);
      const link = this.data.links[sw.linkIds[0]];
      if (!link) continue;
      if (this.data.lines[link.line1.lineId]?.screenId !== sid) continue;
      sw.draw(ctx);
    }

    for (const tr of Object.values(this.data.transformers)) {
      const link = this.data.links[tr.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line || line.screenId !== sid) continue;
      const pt = link.line1.endpoint === "end" ? line.end : line.start;
      tr.draw(ctx, pt, this.data.elapsedSeconds);
    }

    if (this.data.arrival) {
      const arrival = this.data.arrival;
      const line = this.data.lines[arrival.lineId];
      if (line && line.screenId === sid) {
        const pt = arrival.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0];
        if (pt) arrival.draw(ctx, pt);
      }
    }

    if (this.data.start) {
      const start = this.data.start;
      const line = this.data.lines[start.lineId];
      if (line && line.screenId === sid) {
        const pt = start.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0];
        if (pt) {
          const nextWaiting = this.data.tokens
            .filter((t) => t.startId === start.id && this.data.elapsedSeconds < t.startAt)
            .sort((a, b) => a.startAt - b.startAt)[0];
          if (nextWaiting) nextWaiting.draw(ctx, pt);
          start.draw(ctx, pt, nextWaiting ? nextWaiting.startAt - this.data.elapsedSeconds : 0);
        }
      }
    }

    for (const token of this.data.tokens) {
      if (this.data.elapsedSeconds < token.startAt) continue;
      const inPortal = !!token.portalContext;
      const tokenScreenId = this.data.lines[token.lineId]?.screenId ?? "main";
      if (sid === "main" && inPortal) continue;
      if (sid !== "main" && (!inPortal || tokenScreenId !== sid)) continue;
      const line = this.data.lines[token.lineId];
      if (!line || line.points.length === 0) continue;
      const pt = line.points[token.pointIndex];
      if (pt) token.draw(ctx, pt, token.currentSpeed - token.speed, line.points);
    }

    for (const sg of Object.values(this.data.screenGates)) {
      if (sg.screenId !== sid) continue;
      const link = this.data.links[sg.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line) continue;
      const pt = link.line1.endpoint === "end" ? line.end : line.start;
      sg.draw(ctx, pt);
    }

    for (const inv of Object.values(this.data.inverters)) {
      const link = this.data.links[inv.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line || line.screenId !== sid || line.points.length === 0) continue;
      const isEnd = link.line1.endpoint === "end";
      const pt = isEnd ? line.end : line.start;
      const ptAngle = isEnd ? line.points[line.points.length - 1] : line.points[0];
      inv.draw(ctx, pt, ptAngle?.angle ?? 0);
    }

    if (this.data.isInverted) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "difference";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    }

    drawStats(ctx, this.data.fps, this.data.frameMs);
  };

  drawSwitchLinks = (ctx: CanvasRenderingContext2D) => {
    if (Object.keys(this.data.switchLinks).length === 0) return;
    ctx.save();
    ctx.setLineDash([6, 22]);
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 7;
    ctx.lineCap = "square";
    const drawn = new Set<string>();
    for (const [swId, linked] of Object.entries(this.data.switchLinks)) {
      for (const otherId of linked) {
        const key = swId < otherId ? `${swId}:${otherId}` : `${otherId}:${swId}`;
        if (drawn.has(key)) continue;
        drawn.add(key);
        const pa = this.data.switches[swId]?.getPoint();
        const pb = this.data.switches[otherId]?.getPoint();
        if (!pa || !pb) continue;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  clickAt = (x: number, y: number) => {
    if (this.data.previewScreenId !== "main") {
      for (const sg of Object.values(this.data.screenGates)) {
        if (sg.targetScreenId !== this.data.previewScreenId) continue;
        if (!sg.exitKey) continue;
        const [xLineId, xEp] = sg.exitKey.split("::");
        const xLine = this.data.lines[xLineId];
        if (!xLine) continue;
        const pt = xEp === "end" ? xLine.end : xLine.start;
        if ((x - pt.x) ** 2 + (y - pt.y) ** 2 <= 12 ** 2) {
          this.data.previewScreenId = this.data.previewScreenHistory.pop() ?? "main";
          return;
        }
      }
    }
    for (const sg of Object.values(this.data.screenGates)) {
      if (sg.screenId !== this.data.previewScreenId) continue;
      if (!sg.targetScreenId) continue;
      const link = this.data.links[sg.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line) continue;
      const pt = link.line1.endpoint === "end" ? line.end : line.start;
      if (Math.abs(x - pt.x) <= 18 && Math.abs(y - pt.y) <= 32) {
        this.data.previewScreenHistory.push(this.data.previewScreenId);
        this.data.previewScreenId = sg.targetScreenId;
        return;
      }
    }
    this.cycleSwitchAt(x, y);
  };

  cycleSwitchAt = (x: number, y: number) => {
    for (const sw of Object.values(this.data.switches)) {
      if (!sw.hitTest(x, y)) continue;
      const linked = this.data.switchLinks[sw.id] ?? [];
      const toCycle = [sw, ...linked.map((id) => this.data.switches[id]).filter(Boolean)] as SwitchPreview[];
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
