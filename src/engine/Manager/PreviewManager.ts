import type Line from "engine/Line";
import { LinePreview } from "engine/Line";
import type { LineRef, Point } from "engine/types";
import { Start } from "engine/Start";
import { StartPreview } from "engine/Start";
import { Arrival } from "engine/Arrival";
import { ArrivalPreview } from "engine/Arrival";
import { Ball } from "engine/Ball";
import { BallPreview } from "engine/Ball";
import { SwitchPreview } from "engine/Switch";
import type { SwitchAnim } from "engine/Switch";
import { PainterPreview } from "engine/Painter";
import { lerpColor } from "engine/colors";
import { PAINTER_HOLD_MS } from "engine/constants";
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
  balls: Ball[];
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

    this.balls = [];
    for (const d of json.balls ?? []) {
      this.balls.push(new Ball(d.id, d.color, d.speed));
    }
  }

  cycleSwitch(switchId: string): void {
    cycleSwitchUtil(
      switchId,
      this.switches,
      this.activePaths,
      this.allPaths,
      this.switchAnims,
      this.lines,
    );
  }

  initSim(): void {
    this.sim = initSimulation(this.balls, Object.values(this.starts));
  }

  tickSim(): void {
    if (!this.sim) return;
    this.sim = tick(
      this.sim,
      this.lines as unknown as Record<string, Line>,
      this.activePaths,
      this.arrivalPaths,
      this.painterMap,
    );
  }

  resetSim(): void {
    this.sim = null;
    for (const [id, sw] of Object.entries(this.switches)) {
      sw.activeIndex = this.initialSwitchIndices[id] ?? 0;
      const key = `${sw.input.id}::${sw.input.anchor}`;
      const paths = this.allPaths[key];
      if (paths && paths.length > 0)
        this.activePaths[key] = paths[sw.activeIndex];
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

  private drawPreviewPainters(ctx: CanvasRenderingContext2D): void {
    const heldInfo = new Map<string, { progress: number; fromColor: string }>();
    if (this.sim) {
      for (const h of this.sim.held) {
        const key = `${h.ball.lineId}::${h.anchor}`;
        const t = Math.max(0, Math.min(1, (this.sim.elapsed - h.startAt) / PAINTER_HOLD_MS));
        heldInfo.set(key, { progress: t, fromColor: h.fromColor });
      }
    }
    for (const p of Object.values(this.painters)) {
      const point = this.getAnchorPoint(p.input);
      if (!point) continue;
      const key = `${p.input.id}::${p.input.anchor}`;
      const info = heldInfo.get(key);
      p.drawPreview(ctx, point, info?.progress, info?.fromColor);

      const line = this.lines[p.input.id];
      if (line) {
        const other = p.input.anchor === "start"
          ? (line.control ?? line.end)
          : (line.control ?? line.start);
        const dx = other.x - point.x;
        const dy = other.y - point.y;
        const len = Math.hypot(dx, dy) || 1;
        const dotX = point.x + (dx / len) * 8;
        const dotY = point.y + (dy / len) * 8;
        ctx.fillStyle = info !== undefined ? "#ef4444" : "#22c55e";
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
      if (!sw) {
        delete this.switchAnims[swId];
        continue;
      }
      const posLine = this.lines[sw.input.id];
      if (!posLine) {
        delete this.switchAnims[swId];
        continue;
      }
      const point = sw.input.anchor === "start" ? posLine.start : posLine.end;
      sw.drawAnim(ctx, anim, point, this.lines as unknown as Record<string, Line>);
      if (anim.t >= 1) delete this.switchAnims[swId];
    }
  }

  private drawPreviewBalls(ctx: CanvasRenderingContext2D): void {
    if (!this.sim) return;
    BallPreview.drawAll(ctx, this.sim.active, this.lines as unknown as Record<string, Line>);
    for (const { ball, anchor, fromColor, startAt, releaseAt } of this.sim.held) {
      const line = this.lines[ball.lineId];
      if (!line) continue;
      const pt = anchor === "start" ? line.start : line.end;
      const t = Math.max(0, Math.min(1, (this.sim.elapsed - startAt) / (releaseAt - startAt)));
      ctx.fillStyle = lerpColor(fromColor, ball.color, t);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  private drawPreviewStarts(ctx: CanvasRenderingContext2D): void {
    const elapsed = this.sim?.elapsed ?? 0;
    for (const [startId, start] of Object.entries(this.starts)) {
      const line = this.lines[start.position.id];
      if (!line) continue;
      const point = start.position.anchor === "start" ? line.start : line.end;
      const nextPending =
        this.sim?.pending
          .filter((p) => p.instanceId.startsWith(`${startId}::`))
          .sort((a, b) => a.launchAt - b.launchAt)[0] ?? null;
      const countdown = nextPending
        ? Math.max(0, (nextPending.launchAt - elapsed) / 1000)
        : null;
      StartPreview.drawPreviewWithBall(ctx, point, nextPending?.color ?? null, countdown);
    }
  }

  private drawPreviewArrivals(ctx: CanvasRenderingContext2D): void {
    for (const arrival of Object.values(this.arrivals)) {
      const line = this.lines[arrival.position.id];
      if (!line) continue;
      const point = arrival.position.anchor === "start" ? line.start : line.end;
      ArrivalPreview.drawPreview(ctx, point);
      const arrivedHere = this.sim?.arrived.filter((a) => a.arrivalId === arrival.id) ?? [];
      for (const a of arrivedHere) {
        ctx.fillStyle = a.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }

  drawAllPreview(ctx: CanvasRenderingContext2D): void {
    this.drawPreviewLines(ctx);
    this.drawPreviewSwitches(ctx);
    this.drawPreviewSwitchAnims(ctx);
    this.drawPreviewBalls(ctx);
    this.drawPreviewStarts(ctx);
    this.drawPreviewArrivals(ctx);
    this.drawPreviewPainters(ctx);
  }
}
