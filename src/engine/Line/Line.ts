import type { Point } from "engine/types";

export type LineType = "straight" | "curve";

export class Line {
  id: string;
  type: LineType;
  start: Point;
  end: Point;
  control?: Point;
  color: string;
  points: Point[];
  segments: number[];

  static step = 10;

  constructor(id: string, start: Point, end: Point, control?: Point, color: string = "#000000") {
    this.id = id;
    this.type = control ? "curve" : "straight";
    this.start = start;
    this.end = end;
    this.control = control;
    this.color = color;
    this.points = control
      ? Line.computeBezierPoints(start, end, control, Line.step)
      : Line.computePoints(start, end, Line.step);
    this.segments = this.points.slice(0, -1).map((p, i) => {
      const q = this.points[i + 1];
      return Math.sqrt((q.x - p.x) ** 2 + (q.y - p.y) ** 2);
    });
  }

  static round(p: Point): Point {
    return { x: Math.round(p.x), y: Math.round(p.y) };
  }

  static computePoints(start: Point, end: Point, step: number): Point[] {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return [{ ...Line.round(start), a: 0 }];
    const a = Math.atan2(dy, dx);
    const points: Point[] = [];
    const count = Math.floor(distance / step);
    for (let i = 0; i <= count; i++) {
      const t = (i * step) / distance;
      points.push({ ...Line.round({ x: start.x + dx * t, y: start.y + dy * t }), a });
    }
    const last = points[points.length - 1];
    if (last.x !== end.x || last.y !== end.y) points.push({ ...Line.round(end), a });
    return points;
  }

  static bezierPoint(p0: Point, p1: Point, p2: Point, t: number): Point {
    return {
      x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
      y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
    };
  }

  static computeBezierPoints(start: Point, end: Point, control: Point, step: number): Point[] {
    const SAMPLES = 50;
    let length = 0;
    let prev = start;
    for (let i = 1; i <= SAMPLES; i++) {
      const pt = Line.bezierPoint(start, control, end, i / SAMPLES);
      length += Math.sqrt((pt.x - prev.x) ** 2 + (pt.y - prev.y) ** 2);
      prev = pt;
    }
    const count = Math.max(2, Math.floor(length / step));
    const points: Point[] = [];
    for (let i = 0; i <= count; i++) {
      points.push(Line.round(Line.bezierPoint(start, control, end, i / count)));
    }
    for (let i = 0; i < points.length - 1; i++) {
      const nx = points[i + 1].x - points[i].x;
      const ny = points[i + 1].y - points[i].y;
      points[i] = { ...points[i], a: Math.atan2(ny, nx) };
    }
    if (points.length >= 2) {
      points[points.length - 1] = { ...points[points.length - 1], a: points[points.length - 2].a };
    }
    return points;
  }
}
