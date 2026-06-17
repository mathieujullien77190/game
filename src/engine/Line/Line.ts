import type { Point } from "engine/types";
import { computePoints, computeBezierPoints } from "./utils";

export type LineType = "straight" | "curve";

export class Line {
  id: string;
  type: LineType;
  start: Point;
  end: Point;
  control?: Point;
  points: Point[];

  static step = 10;

  constructor(id: string, start: Point, end: Point, control?: Point) {
    this.id = id;
    this.type = control ? "curve" : "straight";
    this.start = start;
    this.end = end;
    this.control = control;
    this.points = control
      ? computeBezierPoints(start, end, control, Line.step)
      : computePoints(start, end, Line.step);
  }
}
