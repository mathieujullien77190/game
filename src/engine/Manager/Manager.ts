import Line from "engine/Line";
import type { LineType } from "engine/Line/Line";
import Link from "engine/Link";
import type { Anchor, LineRef, Point } from "engine/types";
import { Start } from "engine/Start";
import { Arrival } from "engine/Arrival";
import { Ball } from "engine/Ball";
import { Switch } from "engine/Switch";
import { initSimulation, tick } from "engine/Simulation";
import type { SimulationState } from "engine/Simulation";
import { drawLinePoints, drawLineAnchors, drawCurveControl } from "engine/draw/Line/draw";
import { drawStartEditor, drawStartPreviewWithBall } from "engine/draw/Start/draw";
import { drawArrivalEditor, drawArrivalPreview } from "engine/draw/Arrival/draw";
import { drawSwitchEditor, drawSwitchPreview } from "engine/draw/Switch/draw";
import { drawSwitchAnim } from "engine/draw/Switch/animation";
import type { SwitchAnim } from "engine/draw/Switch/animation";
import { SWITCH_ANIM_DURATION_MS } from "engine/draw/Switch/constants";
import { drawLineSimple } from "engine/draw/Line/draw";
import { drawBalls } from "engine/draw/Ball/draw";

type LineData = { id: string; type: LineType; start: Point; end: Point; control?: Point };
type LinkData = { id: string; active: boolean; line1: LineRef; line2: LineRef };
type StartData = { id: string; position: LineRef; delay?: number };
type ArrivalData = { id: string; position: LineRef };
type SwitchData = { id: string; position: LineRef; enter?: LineRef | null };
type BallData = { id: string; color: string; speed: number };

export type LevelJSON = {
  lines: LineData[];
  links: LinkData[];
  starts: StartData[];
  arrivals?: ArrivalData[];
  switches?: SwitchData[];
  balls?: BallData[];
};

export type AnchorTarget = { id: string; anchor: Anchor };

export class Manager {
  lines: Record<string, Line>;
  links: Record<string, Link>;
  starts: Record<string, Start>;
  arrivals: Record<string, Arrival>;
  switches: Record<string, Switch>;
  balls: Ball[];
  anchorIndex: Record<string, AnchorTarget>;
  arrivalIndex: Record<string, string>;
  allPaths: Record<string, AnchorTarget[]>;
  private initialSwitchIndices: Record<string, number> = {};
  private switchAnims: Record<string, SwitchAnim> = {};
  sim: SimulationState | null = null;

  constructor(json: LevelJSON) {
    this.lines = {};
    this.links = {};
    this.starts = {};
    this.arrivals = {};
    this.switches = {};
    this.balls = [];
    this.anchorIndex = {};
    this.arrivalIndex = {};
    this.allPaths = {};

    for (const d of json.lines) {
      this.lines[d.id] = new Line(d.id, d.start, d.end, d.control);
    }

    for (const d of json.links) {
      this.links[d.id] = new Link(d.id, d.line1, d.line2, d.active);
      const k1 = `${d.line1.id}::${d.line1.anchor}`;
      const k2 = `${d.line2.id}::${d.line2.anchor}`;
      if (!this.allPaths[k1]) this.allPaths[k1] = [];
      if (!this.allPaths[k2]) this.allPaths[k2] = [];
      this.allPaths[k1].push({ id: d.line2.id, anchor: d.line2.anchor });
      this.allPaths[k2].push({ id: d.line1.id, anchor: d.line1.anchor });
      if (d.active) {
        this.anchorIndex[k1] = { id: d.line2.id, anchor: d.line2.anchor };
        this.anchorIndex[k2] = { id: d.line1.id, anchor: d.line1.anchor };
      }
    }

    // fallback: anchor with no active link → first available
    for (const [key, targets] of Object.entries(this.allPaths)) {
      if (!this.anchorIndex[key] && targets.length > 0) this.anchorIndex[key] = targets[0];
    }

    for (const d of json.starts ?? []) {
      this.starts[d.id] = new Start(d.id, d.position, d.delay ?? 0);
    }
    for (const d of json.arrivals ?? []) {
      this.arrivals[d.id] = new Arrival(d.id, d.position);
      this.arrivalIndex[`${d.position.id}::${d.position.anchor}`] = d.id;
    }
    for (const d of json.switches ?? []) {
      const sw = new Switch(d.id, d.position, 0, d.enter ?? null);
      const routingRef = sw.inputLine ?? sw.position;
      const key = `${routingRef.id}::${routingRef.anchor}`;
      const paths = this.allPaths[key] ?? [];
      const active = this.anchorIndex[key];
      if (active) {
        const idx = paths.findIndex((p) => p.id === active.id && p.anchor === active.anchor);
        if (idx >= 0) sw.activeIndex = idx;
      }
      this.switches[d.id] = sw;
      this.initialSwitchIndices[d.id] = sw.activeIndex;
    }
    for (const d of json.balls ?? []) {
      this.balls.push(new Ball(d.id, d.color, d.speed));
    }
  }

  private chooseDiff(fromAngle: number, toAngle: number, inputAngle: number | null): number {
    let shortDiff = toAngle - fromAngle;
    while (shortDiff > Math.PI) shortDiff -= 2 * Math.PI;
    while (shortDiff < -Math.PI) shortDiff += 2 * Math.PI;
    if (inputAngle === null) return shortDiff;

    // normalize inputAngle relative to fromAngle into [0, 2π)
    let rel = inputAngle - fromAngle;
    while (rel < 0) rel += 2 * Math.PI;
    while (rel >= 2 * Math.PI) rel -= 2 * Math.PI;

    const crosses = shortDiff >= 0
      ? rel > 0 && rel < shortDiff
      : rel > 2 * Math.PI + shortDiff;

    if (!crosses) return shortDiff;
    return shortDiff >= 0 ? shortDiff - 2 * Math.PI : shortDiff + 2 * Math.PI;
  }

  private getOutputAngle(target: AnchorTarget): number | null {
    const line = this.lines[target.id];
    if (!line) return null;
    const dx = target.anchor === "start"
      ? line.end.x - line.start.x
      : line.start.x - line.end.x;
    const dy = target.anchor === "start"
      ? line.end.y - line.start.y
      : line.start.y - line.end.y;
    return Math.atan2(dy, dx);
  }

  cycleSwitch(switchId: string): void {
    const sw = this.switches[switchId];
    if (!sw) return;
    const routingRef = sw.inputLine ?? sw.position;
    const key = `${routingRef.id}::${routingRef.anchor}`;
    const paths = this.allPaths[key];
    if (!paths || paths.length <= 1) return;
    const oldAngle = this.getOutputAngle(this.anchorIndex[key]);
    sw.activeIndex = (sw.activeIndex + 1) % paths.length;
    this.anchorIndex[key] = paths[sw.activeIndex];
    const newAngle = this.getOutputAngle(this.anchorIndex[key]);
    if (oldAngle !== null && newAngle !== null) {
      const inputAngle = sw.inputLine ? this.getOutputAngle(sw.inputLine) : null;
      const diff = this.chooseDiff(oldAngle, newAngle, inputAngle);
      this.switchAnims[switchId] = { fromAngle: oldAngle, diff, t: 0, duration: SWITCH_ANIM_DURATION_MS };
    }
  }

  initSim(): void {
    this.sim = initSimulation(this.balls, Object.values(this.starts));
  }

  tickSim(): void {
    if (!this.sim) return;
    this.sim = tick(this.sim, this.lines, this.anchorIndex, this.arrivalIndex);
  }

  resetSim(): void {
    this.sim = null;
    for (const [id, sw] of Object.entries(this.switches)) {
      sw.activeIndex = this.initialSwitchIndices[id] ?? 0;
      const key = `${sw.position.id}::${sw.position.anchor}`;
      const paths = this.allPaths[key];
      if (paths && paths.length > 0) this.anchorIndex[key] = paths[sw.activeIndex];
    }
  }

  private getAnchorPoint(ref: LineRef): Point | null {
    const line = this.lines[ref.id];
    if (!line) return null;
    return ref.anchor === "start" ? line.start : line.end;
  }

  drawLine(ctx: CanvasRenderingContext2D, id: string, highlighted = false): void {
    const line = this.lines[id];
    if (!line) return;
    drawLinePoints(ctx, line, highlighted);
    drawLineAnchors(ctx, line);
    drawCurveControl(ctx, line);
  }

  drawAll(
    ctx: CanvasRenderingContext2D,
    highlightedId?: string,
    hoveredStartId?: string,
    hoveredArrivalId?: string,
    hoveredLinkId?: string,
    hoveredSwitchId?: string,
  ): void {
    const hoveredLink = hoveredLinkId ? this.links[hoveredLinkId] : null;
    const isLineHighlighted = (id: string) =>
      id === highlightedId ||
      (hoveredLink != null && (hoveredLink.line1.id === id || hoveredLink.line2.id === id));

    for (const id of Object.keys(this.switches)) {
      const sw = this.switches[id];
      const point = this.getAnchorPoint(sw.position);
      if (!point) continue;
      const key = `${sw.position.id}::${sw.position.anchor}`;
      const activePath = this.anchorIndex[key] ?? null;
      const targetLine = activePath ? (this.lines[activePath.id] ?? null) : null;
      drawSwitchEditor(ctx, point, targetLine, id === hoveredSwitchId);
    }
    for (const id of Object.keys(this.arrivals)) {
      const point = this.getAnchorPoint(this.arrivals[id].position);
      if (point) drawArrivalEditor(ctx, point, id === hoveredArrivalId);
    }
    for (const id of Object.keys(this.starts)) {
      const point = this.getAnchorPoint(this.starts[id].position);
      if (point) drawStartEditor(ctx, point, id === hoveredStartId);
    }
    for (const id of Object.keys(this.lines)) {
      this.drawLine(ctx, id, isLineHighlighted(id));
    }
  }

  private drawPreviewLines(ctx: CanvasRenderingContext2D): void {
    for (const line of Object.values(this.lines)) {
      drawLineSimple(ctx, line);
    }
  }

  private drawPreviewSwitches(ctx: CanvasRenderingContext2D): void {
    for (const sw of Object.values(this.switches)) {
      const posLine = this.lines[sw.position.id];
      if (!posLine) continue;
      const point = sw.position.anchor === "start" ? posLine.start : posLine.end;
      const routingRef = sw.inputLine ?? sw.position;
      const key = `${routingRef.id}::${routingRef.anchor}`;
      const activePath = this.anchorIndex[key] ?? null;
      const inputLine = sw.inputLine ? (this.lines[sw.inputLine.id] ?? null) : null;
      const targetLine = activePath ? (this.lines[activePath.id] ?? null) : null;
      drawSwitchPreview(ctx, point, inputLine, sw.inputLine?.anchor ?? null, targetLine, activePath?.anchor ?? null);
    }
  }

  private drawPreviewSwitchAnims(ctx: CanvasRenderingContext2D): void {
    for (const [swId, anim] of Object.entries(this.switchAnims)) {
      const sw = this.switches[swId];
      if (!sw) { delete this.switchAnims[swId]; continue; }
      const posLine = this.lines[sw.position.id];
      if (!posLine) { delete this.switchAnims[swId]; continue; }
      const point = sw.position.anchor === "start" ? posLine.start : posLine.end;
      drawSwitchAnim(ctx, anim, sw, point, this.lines);
      if (anim.t >= 1) delete this.switchAnims[swId];
    }
  }

  private drawPreviewBalls(ctx: CanvasRenderingContext2D): void {
    if (this.sim) drawBalls(ctx, this.sim.active, this.lines);
  }

  private drawPreviewStarts(ctx: CanvasRenderingContext2D): void {
    const elapsed = this.sim?.elapsed ?? 0;
    for (const [startId, start] of Object.entries(this.starts)) {
      const line = this.lines[start.position.id];
      if (!line) continue;
      const point = start.position.anchor === "start" ? line.start : line.end;
      const nextPending = this.sim?.pending
        .filter((p) => p.instanceId.startsWith(`${startId}::`))
        .sort((a, b) => a.launchAt - b.launchAt)[0] ?? null;
      const countdown = nextPending ? Math.max(0, (nextPending.launchAt - elapsed) / 1000) : null;
      drawStartPreviewWithBall(ctx, point, nextPending?.color ?? null, countdown);
    }
  }

  private drawPreviewArrivals(ctx: CanvasRenderingContext2D): void {
    for (const arrival of Object.values(this.arrivals)) {
      const line = this.lines[arrival.position.id];
      if (!line) continue;
      const point = arrival.position.anchor === "start" ? line.start : line.end;
      drawArrivalPreview(ctx, point);
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
  }
}
