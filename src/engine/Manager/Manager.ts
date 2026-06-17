import Line from "engine/Line";
import type { LineType } from "engine/Line/Line";
import Link from "engine/Link";
import type { LineRef, Point } from "engine/types";
import { Start } from "engine/Start";
import {
  drawLinePoints,
  drawLineAnchors,
  drawCurveControl,
  drawLineReal,
  drawStartEditor,
  drawStartPreview,
} from "engine/draw";

type LineData = { id: string; type: LineType; start: Point; end: Point; control?: Point };
type LinkData = { id: string; active: boolean; line1: LineRef; line2: LineRef };
type StartData = { id: string; position: LineRef };

export type LevelJSON = {
  lines: LineData[];
  links: LinkData[];
  starts: StartData[];
};

export class Manager {
  lines: Record<string, Line>;
  links: Record<string, Link>;
  starts: Record<string, Start>;

  constructor(json: LevelJSON) {
    this.lines = {};
    this.links = {};
    this.starts = {};

    for (const d of json.lines) {
      this.lines[d.id] = new Line(d.id, d.start, d.end, d.control);
    }
    for (const d of json.links) {
      this.links[d.id] = new Link(d.id, d.line1, d.line2, d.active);
    }
    for (const d of json.starts ?? []) {
      this.starts[d.id] = new Start(d.id, d.position);
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

  drawAll(ctx: CanvasRenderingContext2D, highlightedId?: string, hoveredStartId?: string): void {
    for (const id of Object.keys(this.starts)) {
      const point = this.getAnchorPoint(this.starts[id].position);
      if (point) drawStartEditor(ctx, point, id === hoveredStartId);
    }
    for (const id of Object.keys(this.lines)) {
      this.drawLine(ctx, id, id === highlightedId);
    }
  }

  drawLinePreview(ctx: CanvasRenderingContext2D, id: string): void {
    const line = this.lines[id];
    if (!line) return;
    drawLineReal(ctx, line);
  }

  drawAllPreview(ctx: CanvasRenderingContext2D): void {
    for (const id of Object.keys(this.starts)) {
      const point = this.getAnchorPoint(this.starts[id].position);
      if (point) drawStartPreview(ctx, point);
    }
    for (const id of Object.keys(this.lines)) {
      this.drawLinePreview(ctx, id);
    }
  }
}
