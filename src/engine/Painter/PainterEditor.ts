import type { Point } from "engine/types";
import { PainterPreview } from "./PainterPreview";

export class PainterEditor extends PainterPreview {
  drawEditor(ctx: CanvasRenderingContext2D, point: Point, hovered = false): void {
    const R = hovered ? 17 : 13;
    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.arc(point.x, point.y, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}
