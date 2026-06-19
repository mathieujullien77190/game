import type Line from "engine/Line";
import { LinePreview } from "engine/Line";
import type { LineRef, Point } from "engine/types";
import { Start } from "engine/Start";
import { StartPreview } from "engine/Start";
import { Arrival } from "engine/Arrival";
import { ArrivalPreview } from "engine/Arrival";
import { Token } from "engine/Token";
import { TokenPreview } from "engine/Token";
import { SwitchPreview } from "engine/Switch";
import type { SwitchAnim } from "engine/Switch";
import { PainterPreview } from "engine/Painter";
import { PAINTER_HOLD_MS } from "engine/constants";
import { lerpColor } from "engine/colors";
import { buildRouting, cycleSwitch as cycleSwitchUtil } from "./routing";
import type { LevelJSON, AnchorTarget } from "./routing";
import { initSimulation, tick } from "engine/Simulation";
import type { SimulationState } from "engine/Simulation";

export class PreviewManager {
  lines: Record<string, LinePreview>;
  switches: Record<string, SwitchPreview>;
  painters: Record<string, PainterPreview>;
  starts: Record<string, Start>;
  arrivals: Record<string, Arrival>;
  tokens: Token[];
  activePaths: Record<string, AnchorTarget>;
  allPaths: Record<string, AnchorTarget[]>;
  arrivalPaths: Record<string, string>;
  painterMap: Record<string, string>;
  private initialSwitchIndices: Record<string, number>;
  private switchAnims: Record<string, SwitchAnim> = {};
  sim: SimulationState | null = null;

  constructor(json: LevelJSON) {
    this.lines = {};
    for (const d of json.lines) {
      this.lines[d.id] = new LinePreview(d.id, d.start, d.end, d.control, d.color);
    }

    const routing = buildRouting(json);
    this.activePaths = routing.activePaths;
    this.allPaths = routing.allPaths;
    this.arrivalPaths = routing.arrivalPaths;
    this.painterMap = routing.painterMap;
    this.initialSwitchIndices = routing.initialSwitchIndices;

    this.switches = {};
    for (const [id, sw] of Object.entries(routing.switches)) {
      this.switches[id] = new SwitchPreview(id, sw.input, sw.activeIndex);
    }

    this.painters = {};
    for (const [id, p] of Object.entries(routing.painters)) {
      this.painters[id] = new PainterPreview(id, p.input, p.color);
    }

    this.starts = {};
    for (const d of json.starts ?? []) {
      this.starts[d.id] = new Start(d.id, d.position, d.delay ?? 0);
    }

    this.arrivals = {};
    for (const d of json.arrivals ?? []) {
      this.arrivals[d.id] = new Arrival(d.id, d.position);
    }

    this.tokens = [];
    for (const d of json.tokens ?? []) {
      this.tokens.push(new Token(d.id, d.color, d.speed, d.shape ?? "circle"));
    }
  }

  cycleSwitch(switchId: string): void {
    cycleSwitchUtil(switchId, this.switches, this.activePaths, this.allPaths, this.switchAnims, this.lines);
  }

  initSim(): void {
    this.sim = initSimulation(this.tokens, Object.values(this.starts), this.lines as unknown as Record<string, Line>);
  }

  tickSim(): void {
    if (!this.sim) return;
    this.sim = tick(this.sim, this.lines as unknown as Record<string, Line>, this.activePaths, this.arrivalPaths, this.painterMap);
  }

  resetSim(): void {
    this.sim = null;
    for (const [id, sw] of Object.entries(this.switches)) {
      sw.activeIndex = this.initialSwitchIndices[id] ?? 0;
      const key = `${sw.input.id}::${sw.input.anchor}`;
      const paths = this.allPaths[key];
      if (paths && paths.length > 0) this.activePaths[key] = paths[sw.activeIndex];
    }
  }

  private getAnchorPoint(ref: LineRef): Point | null {
    const line = this.lines[ref.id];
    if (!line) return null;
    return ref.anchor === "start" ? line.start : line.end;
  }

  private drawPreviewLines(ctx: CanvasRenderingContext2D): void {
    for (const line of Object.values(this.lines)) {
      line.drawSimple(ctx);
    }
  }

  private buildPainterHeldInfo(): Map<string, number> {
    const map = new Map<string, number>();
    if (!this.sim) return map;
    for (const token of this.sim.active) {
      if (token.pauseUntil === undefined) continue;
      const startAt = token.pauseUntil - PAINTER_HOLD_MS;
      const t = Math.max(0, Math.min(1, (this.sim.elapsed - startAt) / PAINTER_HOLD_MS));
      const anchor = token.direction === 1 ? "end" : "start";
      map.set(`${token.lineId}::${anchor}`, t);
    }
    return map;
  }

  private drawPreviewPaintersBefore(ctx: CanvasRenderingContext2D): void {
    for (const p of Object.values(this.painters)) {
      const point = this.getAnchorPoint(p.input);
      if (!point) continue;
      p.drawBefore(ctx, point);
    }
  }

  private drawPreviewPaintersAfter(ctx: CanvasRenderingContext2D): void {
    const heldInfo = this.buildPainterHeldInfo();
    for (const p of Object.values(this.painters)) {
      const point = this.getAnchorPoint(p.input);
      if (!point) continue;
      const key = `${p.input.id}::${p.input.anchor}`;
      const progress = heldInfo.get(key);
      p.drawAfter(ctx, point, progress);

      const line = this.lines[p.input.id];
      if (line) {
        const other = p.input.anchor === "start" ? (line.control ?? line.end) : (line.control ?? line.start);
        const dx = other.x - point.x;
        const dy = other.y - point.y;
        const len = Math.hypot(dx, dy) || 1;
        const dotX = point.x + (dx / len) * 14;
        const dotY = point.y + (dy / len) * 14;
        ctx.fillStyle = progress !== undefined ? "#ef4444" : "#22c55e";
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  private drawPreviewSwitches(ctx: CanvasRenderingContext2D): void {
    for (const sw of Object.values(this.switches)) {
      const posLine = this.lines[sw.input.id];
      if (!posLine) continue;
      const point = sw.input.anchor === "start" ? posLine.start : posLine.end;
      const key = `${sw.input.id}::${sw.input.anchor}`;
      const activePath = this.activePaths[key] ?? null;
      const inputLine = this.lines[sw.input.id] ?? null;
      const targetLine = activePath ? (this.lines[activePath.id] ?? null) : null;
      sw.drawPreview(ctx, point, inputLine, sw.input.anchor, targetLine, activePath?.anchor ?? null);
    }
  }

  private drawPreviewSwitchAnims(ctx: CanvasRenderingContext2D): void {
    for (const [swId, anim] of Object.entries(this.switchAnims)) {
      const sw = this.switches[swId];
      if (!sw) { delete this.switchAnims[swId]; continue; }
      const posLine = this.lines[sw.input.id];
      if (!posLine) { delete this.switchAnims[swId]; continue; }
      const point = sw.input.anchor === "start" ? posLine.start : posLine.end;
      sw.drawAnim(ctx, anim, point, this.lines as unknown as Record<string, Line>);
      if (anim.t >= 1) delete this.switchAnims[swId];
    }
  }

  private drawPreviewTokens(ctx: CanvasRenderingContext2D): void {
    if (!this.sim) return;
    for (const token of this.sim.active) {
      const pos = TokenPreview.resolvePosition(token, this.lines as unknown as Record<string, Line>);
      if (!pos) continue;
      let color = token.color;
      if (token.pauseUntil !== undefined && token.fromColor !== undefined) {
        const startAt = token.pauseUntil - PAINTER_HOLD_MS;
        const t = Math.max(0, Math.min(1, (this.sim.elapsed - startAt) / PAINTER_HOLD_MS));
        color = lerpColor(token.fromColor, token.color, t);
      }
      if (token.shape === "square") {
        TokenPreview.drawSquare(ctx, pos.x, pos.y, pos.angle, color);
      } else {
        TokenPreview.drawCircle(ctx, pos.x, pos.y, color);
      }
    }
  }

  private getStartData(): { point: Point; countdown: number | null }[] {
    const elapsed = this.sim?.elapsed ?? 0;
    return Object.entries(this.starts).flatMap(([startId, start]) => {
      const line = this.lines[start.position.id];
      if (!line) return [];
      const point = start.position.anchor === "start" ? line.start : line.end;
      const nextFrozen =
        this.sim?.active
          .filter((c) => c.instanceId.startsWith(`${startId}::`) && c.launchAt > elapsed)
          .sort((a, b) => a.launchAt - b.launchAt)[0] ?? null;
      const countdown = nextFrozen ? Math.max(0, (nextFrozen.launchAt - elapsed) / 1000) : null;
      return [{ point, countdown }];
    });
  }

  private drawPreviewStartsBefore(ctx: CanvasRenderingContext2D): void {
    for (const { point } of this.getStartData()) {
      StartPreview.drawBefore(ctx, point);
    }
  }

  private drawPreviewStartsAfter(ctx: CanvasRenderingContext2D): void {
    for (const { point, countdown } of this.getStartData()) {
      StartPreview.drawAfter(ctx, point, countdown);
    }
  }

  private getArrivalPoints(): { point: { x: number; y: number } }[] {
    return Object.values(this.arrivals).flatMap((arrival) => {
      const line = this.lines[arrival.position.id];
      if (!line) return [];
      const point = arrival.position.anchor === "start" ? line.start : line.end;
      return [{ point }];
    });
  }

  private drawPreviewArrivalsBg(ctx: CanvasRenderingContext2D): void {
    for (const { point } of this.getArrivalPoints()) {
      ArrivalPreview.drawBefore(ctx, point);
    }
  }

  private drawPreviewArrivalsBorder(ctx: CanvasRenderingContext2D): void {
    for (const { point } of this.getArrivalPoints()) {
      ArrivalPreview.drawAfter(ctx, point);
    }
  }

  drawAllPreview(ctx: CanvasRenderingContext2D): void {
    this.drawPreviewLines(ctx);
    this.drawPreviewSwitches(ctx);
    this.drawPreviewSwitchAnims(ctx);
    this.drawPreviewArrivalsBg(ctx);
    this.drawPreviewStartsBefore(ctx);
    this.drawPreviewPaintersBefore(ctx);
    this.drawPreviewTokens(ctx);
    this.drawPreviewArrivalsBorder(ctx);
    this.drawPreviewStartsAfter(ctx);
    this.drawPreviewPaintersAfter(ctx);
  }
}
