import { CANVAS_H, CANVAS_W, GRID_MAJOR, GRID_MINOR } from "../constants";
import { LinePreview } from "../Line/LinePreview";
import type { Link, LinkEndpoint } from "../Link/Link";
import type { Start } from "../Start/Start";
import { StartPreview } from "../Start/StartPreview";
import type { Switch } from "../Switch/Switch";
import { SwitchPreview } from "../Switch/SwitchPreview";
import { drawStats, smoothFps } from "../stats";
import type { Token } from "../Token/Token";
import { TokenPreview } from "../Token/TokenPreview";
import { Manager } from "./Manager";

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
  ) => {
    this.data.switchLinks = switchLinks;
    this.data.links = links;
    this.data.linkMap = {};
    this.data.elapsedSeconds = 0;
    this.data.lastTimestamp = null;

    for (const lk of Object.values(links)) {
      if (!lk.activated) continue;
      const k1 = `${lk.line1.lineId}::${lk.line1.endpoint}`;
      const k2 = `${lk.line2.lineId}::${lk.line2.endpoint}`;
      this.data.linkMap[k1] = lk.line2;
      this.data.linkMap[k2] = lk.line1;
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
    const deltaMs = Math.min(timestamp - this.data.lastTimestamp, 100);
    this.data.lastTimestamp = timestamp;
    this.data.fps = smoothFps(this.data.fps, deltaMs);

    const deltaSeconds = deltaMs / 1000;
    this.data.elapsedSeconds += deltaSeconds;

    for (const sw of Object.values(this.data.switches)) sw.tick(deltaSeconds);

    for (const token of this.data.tokens) {
      if (this.data.elapsedSeconds < token.startAt) continue;
      if (token.direction === 0 || token.speed === 0) continue;
      const line = this.data.lines[token.lineId];
      if (!line) continue;
      const result = token.advance(deltaSeconds, line.points.length);
      if (result) this.transitionToken(token, result.hit, result.excess);
    }
  };

  private transitionToken = (token: TokenPreview, arrivedAt: "start" | "end", excess: number) => {
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

  drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.setLineDash([]);
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= CANVAS_W; x += GRID_MINOR) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_H; y += GRID_MINOR) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
    }
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_W; x += GRID_MAJOR) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_H; y += GRID_MAJOR) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
    }
  };

  drawAllPreview = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
    this.drawGrid(ctx);

    this.drawSwitchLinks(ctx);
    for (const line of Object.values(this.data.lines)) line.draw(ctx);

    for (const sw of Object.values(this.data.switches)) {
      sw.prepareFrame(this.data.lines, this.data.links, this.data.linkMap);
      sw.draw(ctx);
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
      if (pt) token.draw(ctx, pt);
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
