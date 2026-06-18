import type { Point } from "engine/types";
import type Line from "engine/Line";
import { SwitchPreview } from "./SwitchPreview";

export class SwitchEditor extends SwitchPreview {
  drawEditor(ctx: CanvasRenderingContext2D, point: Point, _targetLine: Line | null, hovered = false): void {
    const radius = hovered ? 18 : 14;
    ctx.fillStyle = "#6b7280";
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
