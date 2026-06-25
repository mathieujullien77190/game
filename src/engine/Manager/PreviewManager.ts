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
import type { Rotator } from "../Rotator/Rotator";
import { RotatorPreview } from "../Rotator/RotatorPreview";
import type { Painter } from "../Painter/Painter";
import { PainterPreview } from "../Painter/PainterPreview";
import type { Fader } from "../Fader/Fader";
import { FaderPreview } from "../Fader/FaderPreview";
import type { Inverter } from "../Inverter/Inverter";
import { InverterPreview } from "../Inverter/InverterPreview";
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
    rotators: {} as Record<string, RotatorPreview>,
    rotatorLinkIds: new Set<string>(),
    linkByEndpointKey: {} as Record<string, string>,
    painters: {} as Record<string, PainterPreview>,
    painterByLinkId: {} as Record<string, PainterPreview>,
    faders: {} as Record<string, FaderPreview>,
    faderLinkIds: new Set<string>(),
    inverters: {} as Record<string, InverterPreview>,
    inverterLinkIds: new Set<string>(),
    isInverted: false,
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
    rotators: Record<string, Rotator> = {},
    painters: Record<string, Painter> = {},
    arrival: Arrival | null = null,
    faders: Record<string, Fader> = {},
    inverters: Record<string, Inverter> = {},
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

    this.data.rotators = {};
    this.data.rotatorLinkIds = new Set();
    for (const r of Object.values(rotators)) {
      this.data.rotators[r.id] = new RotatorPreview(r.linkId, r.id);
      this.data.rotatorLinkIds.add(r.linkId);
    }

    this.data.painters = {};
    this.data.painterByLinkId = {};
    for (const p of Object.values(painters)) {
      const pp = new PainterPreview(p.linkId, p.color, p.id);
      this.data.painters[p.id] = pp;
      this.data.painterByLinkId[p.linkId] = pp;
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

    this.data.faders = {};
    this.data.faderLinkIds = new Set();
    for (const f of Object.values(faders)) {
      this.data.faders[f.id] = new FaderPreview(f.linkId, f.id, f.amount);
      this.data.faderLinkIds.add(f.linkId);
    }

    this.data.inverters = {};
    this.data.inverterLinkIds = new Set();
    this.data.isInverted = false;
    for (const inv of Object.values(inverters)) {
      this.data.inverters[inv.id] = new InverterPreview(inv.linkId, inv.id);
      this.data.inverterLinkIds.add(inv.linkId);
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

      if (token.isPainting) {
        token.paintProgress = Math.min(1, token.paintProgress + deltaSeconds / PAINT_DURATION);
        const activePainter = this.data.painterByLinkId[token.paintingLinkId];
        if (activePainter) {
          activePainter.paintProgress = token.paintProgress;
          activePainter.currentTokenColor = token.displayColor || (token.color as string);
        }
        if (token.paintProgress >= 1) {
          token.isPainting = false;
          if (activePainter) { activePainter.paintProgress = -1; activePainter.currentTokenColor = ""; }
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
        const targetSpeed = Math.max(1, token.speed + line.boost);
        const k = ACCEL_TIME > 0 ? 1 - Math.exp(-deltaSeconds / ACCEL_TIME) : 1;
        token.currentSpeed += (targetSpeed - token.currentSpeed) * k;
        const result = token.advance(deltaSeconds, line.points.length);
        if (result) this.transitionToken(token, result.hit, result.excess);

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

  private transitionToken = (token: TokenPreview, arrivedAt: "start" | "end", excess: number) => {
    if (this.data.arrivalKey && this.data.arrivalKey === `${token.lineId}::${arrivedAt}`) {
      if (this.data.arrival) {
        this.data.arrival.isFading = true;
        this.data.arrival.fadeAlpha = 1;
      }
      token.arrived = true;
      token.direction = 0;
      return;
    }
    const linkId = this.data.linkByEndpointKey[`${token.lineId}::${arrivedAt}`];
    if (linkId && this.data.rotatorLinkIds.has(linkId)) {
      token.targetRotationOffset += Math.PI * 2.25;
    }
    if (linkId && this.data.faderLinkIds.has(linkId)) {
      const fader = Object.values(this.data.faders).find((f) => f.linkId === linkId);
      if (fader) token.opacity = fader.amount;
    }
    if (linkId && this.data.inverterLinkIds.has(linkId)) {
      this.data.isInverted = !this.data.isInverted;
    }
    const painter = linkId ? this.data.painterByLinkId[linkId] : undefined;
    if (painter) {
      token.colorTransitionFrom = token.displayColor || (token.color as string);
      token.color = painter.color as any;
      token.colorProgress = 0;
      token.isPainting = true;
      token.paintProgress = 0;
      token.paintingLinkId = linkId;
      token.direction = 0;
      painter.paintProgress = 0;
      const other = this.data.linkMap[`${token.lineId}::${arrivedAt}`];
      if (other) {
        const newLine = this.data.lines[other.lineId];
        token.pendingLineId = other.lineId;
        token.pendingPointIndex = other.endpoint === "start" ? 0 : (newLine?.points.length ?? 1) - 1;
        token.pendingDirection = other.endpoint === "start" ? 1 : -1;
        token.pendingRemainder = excess;
      } else {
        const line = this.data.lines[token.lineId];
        token.pointIndex = arrivedAt === "end" ? (line?.points.length ?? 1) - 1 : 0;
        token.remainder = 0;
        token.pendingLineId = "";
      }
      return;
    }
    const other = this.data.linkMap[`${token.lineId}::${arrivedAt}`];
    if (other) {
      token.lineId = other.lineId;
      const newLine = this.data.lines[token.lineId];
      token.pointIndex = other.endpoint === "start" ? 0 : (newLine?.points.length ?? 1) - 1;
      token.direction = other.endpoint === "start" ? 1 : -1;
      token.remainder = excess;
    } else {
      const line = this.data.lines[token.lineId];
      token.pointIndex = arrivedAt === "end" ? (line?.points.length ?? 1) - 1 : 0;
      token.remainder = 0;
      token.direction = 0;
    }
  };

  drawAllPreview = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
    this.drawSwitchLinks(ctx);
    for (const line of Object.values(this.data.lines)) line.drawGlow(ctx);
    for (const line of Object.values(this.data.lines)) line.draw(ctx);

    for (const sw of Object.values(this.data.switches)) {
      sw.prepareFrame(this.data.lines, this.data.links, this.data.linkMap);
      sw.draw(ctx);
    }

    for (const rot of Object.values(this.data.rotators)) {
      const link = this.data.links[rot.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line) continue;
      const pt = link.line1.endpoint === "end" ? line.end : line.start;
      rot.draw(ctx, pt, this.data.elapsedSeconds);
    }

    for (const p of Object.values(this.data.painters)) {
      const link = this.data.links[p.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line) continue;
      const pt = link.line1.endpoint === "end" ? line.end : line.start;
      p.draw(ctx, pt, this.data.elapsedSeconds);
    }

    if (this.data.arrival) {
      const arrival = this.data.arrival;
      const line = this.data.lines[arrival.lineId];
      if (line) {
        const pt = arrival.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0];
        if (pt) arrival.draw(ctx, pt);
      }
    }

    if (this.data.start) {
      const start = this.data.start;
      const line = this.data.lines[start.lineId];
      if (line) {
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
      const line = this.data.lines[token.lineId];
      if (!line || line.points.length === 0) continue;
      const pt = line.points[token.pointIndex];
      if (pt) token.draw(ctx, pt, token.currentSpeed - token.speed, line.points);
    }

    for (const f of Object.values(this.data.faders)) {
      const link = this.data.links[f.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line) continue;
      const pt = link.line1.endpoint === "end" ? line.end : line.start;
      f.draw(ctx, pt);
    }

    for (const inv of Object.values(this.data.inverters)) {
      const link = this.data.links[inv.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line || line.points.length === 0) continue;
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
