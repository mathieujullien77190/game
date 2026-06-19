import type { Point } from "engine/types";
import { Start } from "./Start";

const OUTER_R = 18;
const INNER_R = 12;
const RING_R = (OUTER_R + INNER_R) / 2;
const RING_W = OUTER_R - INNER_R;

export class StartPreview extends Start {
  static drawBefore(ctx: CanvasRenderingContext2D, point: Point): void {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(point.x, point.y, INNER_R, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawAfter(ctx: CanvasRenderingContext2D, point: Point, countdown: number | null): void {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = RING_W;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(point.x, point.y, RING_R, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(point.x, point.y, OUTER_R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(point.x, point.y, INNER_R, 0, Math.PI * 2);
    ctx.stroke();

    if (countdown !== null && countdown > 0) {
      ctx.fillStyle = "#000000";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(Math.ceil(countdown).toString(), point.x, point.y);
    }
  }
}
