import type { Point } from "engine/types";

const round = (p: Point): Point => ({ x: Math.round(p.x), y: Math.round(p.y) });

export const computePoints = (start: Point, end: Point, step: number): Point[] => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return [round(start)];

  const points: Point[] = [];
  const count = Math.floor(distance / step);

  for (let i = 0; i <= count; i++) {
    const t = (i * step) / distance;
    points.push(round({ x: start.x + dx * t, y: start.y + dy * t }));
  }

  const last = points[points.length - 1];
  if (last.x !== end.x || last.y !== end.y) {
    points.push(round(end));
  }

  return points;
};

const bezierPoint = (p0: Point, p1: Point, p2: Point, t: number): Point => ({
  x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
  y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
});

export const computeBezierPoints = (
  start: Point,
  end: Point,
  control: Point,
  step: number
): Point[] => {
  const SAMPLES = 50;
  let length = 0;
  let prev = start;

  for (let i = 1; i <= SAMPLES; i++) {
    const pt = bezierPoint(start, control, end, i / SAMPLES);
    length += Math.sqrt((pt.x - prev.x) ** 2 + (pt.y - prev.y) ** 2);
    prev = pt;
  }

  const count = Math.max(2, Math.floor(length / step));
  const points: Point[] = [];

  for (let i = 0; i <= count; i++) {
    points.push(round(bezierPoint(start, control, end, i / count)));
  }

  return points;
};
