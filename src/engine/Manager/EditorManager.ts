import Link from "engine/Link";
import type { LineRef, Point } from "engine/types";
import { LineEditor } from "engine/Line";
import { Start } from "engine/Start";
import { StartEditor } from "engine/Start";
import { Arrival } from "engine/Arrival";
import { ArrivalEditor } from "engine/Arrival";
import { Token } from "engine/Token";
import { SwitchEditor } from "engine/Switch";
import type { SwitchAnim } from "engine/Switch";
import { PainterEditor } from "engine/Painter";
import { buildRouting, cycleSwitch as cycleSwitchUtil } from "./routing";
import type { LevelJSON, AnchorTarget } from "./routing";

export class EditorManager {
  lines: Record<string, LineEditor>;
  switches: Record<string, SwitchEditor>;
  painters: Record<string, PainterEditor>;
  starts: Record<string, Start>;
  arrivals: Record<string, Arrival>;
  tokens: Token[];
  links: Record<string, Link>;
  activePaths: Record<string, AnchorTarget>;
  allPaths: Record<string, AnchorTarget[]>;
  arrivalPaths: Record<string, string>;
  private initialSwitchIndices: Record<string, number>;
  private switchAnims: Record<string, SwitchAnim> = {};

  constructor(json: LevelJSON) {
    this.lines = {};
    for (const d of json.lines) {
      this.lines[d.id] = new LineEditor(d.id, d.start, d.end, d.control, d.color);
    }

    const routing = buildRouting(json);
    this.links = routing.links;
    this.activePaths = routing.activePaths;
    this.allPaths = routing.allPaths;
    this.arrivalPaths = routing.arrivalPaths;
    this.initialSwitchIndices = routing.initialSwitchIndices;
    this.switches = routing.switches;
    this.painters = routing.painters;

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

  private getAnchorPoint(ref: LineRef): Point | null {
    const line = this.lines[ref.id];
    if (!line) return null;
    return ref.anchor === "start" ? line.start : line.end;
  }

  drawLine(ctx: CanvasRenderingContext2D, id: string, highlighted = false): void {
    const line = this.lines[id];
    if (!line) return;
    line.drawPoints(ctx, highlighted);
    line.drawAnchors(ctx);
    line.drawCurveControl(ctx);
  }

  drawAll(
    ctx: CanvasRenderingContext2D,
    highlightedId?: string,
    hoveredStartId?: string,
    hoveredArrivalId?: string,
    hoveredLinkId?: string,
    hoveredSwitchId?: string,
    hoveredPainterId?: string,
  ): void {
    const hoveredLink = hoveredLinkId ? this.links[hoveredLinkId] : null;
    const isLineHighlighted = (id: string) =>
      id === highlightedId ||
      (hoveredLink != null && (hoveredLink.line1.id === id || hoveredLink.line2.id === id));

    for (const id of Object.keys(this.painters)) {
      const p = this.painters[id];
      const point = this.getAnchorPoint(p.input);
      if (!point) continue;
      p.drawEditor(ctx, point, id === hoveredPainterId);
    }

    for (const id of Object.keys(this.switches)) {
      const sw = this.switches[id];
      const point = this.getAnchorPoint(sw.input);
      if (!point) continue;
      const key = `${sw.input.id}::${sw.input.anchor}`;
      const activePath = this.activePaths[key] ?? null;
      const targetLine = activePath ? (this.lines[activePath.id] ?? null) : null;
      sw.drawEditor(ctx, point, targetLine, id === hoveredSwitchId);
    }
    for (const id of Object.keys(this.arrivals)) {
      const point = this.getAnchorPoint(this.arrivals[id].position);
      if (point) ArrivalEditor.drawEditor(ctx, point, id === hoveredArrivalId);
    }
    for (const id of Object.keys(this.starts)) {
      const point = this.getAnchorPoint(this.starts[id].position);
      if (point) StartEditor.drawEditor(ctx, point, id === hoveredStartId);
    }
    for (const id of Object.keys(this.lines)) {
      this.drawLine(ctx, id, isLineHighlighted(id));
    }
  }
}
