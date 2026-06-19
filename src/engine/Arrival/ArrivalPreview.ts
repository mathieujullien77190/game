import type { Point } from "engine/types";
import { Arrival } from "./Arrival";

export class ArrivalPreview extends Arrival {
  static drawBefore(ctx: CanvasRenderingContext2D, point: Point): void {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawAfter(ctx: CanvasRenderingContext2D, point: Point): void {
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
    ctx.stroke();
  }
}
