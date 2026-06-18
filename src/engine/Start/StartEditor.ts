import type { Point } from "engine/types";
import { EDITOR_COLORS } from "engine/colors";
import { StartPreview } from "./StartPreview";

export class StartEditor extends StartPreview {
  static drawEditor(ctx: CanvasRenderingContext2D, point: Point, hovered = false): void {
    const radius = hovered ? 13 : 10;
    ctx.fillStyle = EDITOR_COLORS.departure;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = EDITOR_COLORS.departureBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}
