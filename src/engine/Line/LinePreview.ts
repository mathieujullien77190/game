import { Line } from "./Line";

export class LinePreview extends Line {
  drawSimple(ctx: CanvasRenderingContext2D, color?: string): void {
    ctx.strokeStyle = color ?? this.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    if (this.control) {
      ctx.quadraticCurveTo(this.control.x, this.control.y, this.end.x, this.end.y);
    } else {
      ctx.lineTo(this.end.x, this.end.y);
    }
    ctx.stroke();
  }
}
