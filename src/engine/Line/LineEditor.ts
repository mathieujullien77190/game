import type { Point } from "engine/types";
import { EDITOR_COLORS } from "engine/colors";
import { Line } from "./Line";
import { LinePreview } from "./LinePreview";

export class LineEditor extends LinePreview {
  drawPoints(ctx: CanvasRenderingContext2D, highlighted = false): void {
    ctx.fillStyle = "#111827";
    const radius = highlighted ? 2 : 1;
    for (const pt of this.points) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawAnchors(ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 1;
    ctx.strokeStyle = EDITOR_COLORS.anchorStart;
    ctx.beginPath();
    ctx.arc(this.start.x, this.start.y, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = EDITOR_COLORS.anchorEnd;
    ctx.beginPath();
    ctx.arc(this.end.x, this.end.y, 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawCurveControl(ctx: CanvasRenderingContext2D): void {
    if (!this.control) return;
    ctx.strokeStyle = "#c4b5fd";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.control.x, this.control.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.control.x, this.control.y, 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  static drawPreview(ctx: CanvasRenderingContext2D, start: Point, end: Point): void {
    const preview = new Line("_preview", start, end);
    ctx.fillStyle = "#93c5fd";
    for (const pt of preview.points) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  static drawCurvePreview(ctx: CanvasRenderingContext2D, start: Point, end: Point, control: Point): void {
    const preview = new Line("_preview", start, end, control);
    ctx.fillStyle = "#c4b5fd";
    for (const pt of preview.points) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "#c4b5fd";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(control.x, control.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(control.x, control.y, 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  static drawHoverPoint(ctx: CanvasRenderingContext2D, point: Point): void {
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  static drawPendingStart(ctx: CanvasRenderingContext2D, point: Point): void {
    ctx.strokeStyle = EDITOR_COLORS.anchorStart;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  static drawPendingEnd(ctx: CanvasRenderingContext2D, point: Point): void {
    ctx.strokeStyle = EDITOR_COLORS.anchorEnd;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.stroke();
  }
}
