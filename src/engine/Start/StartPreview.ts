import type { Point } from "engine/types";
import { Start } from "./Start";

export class StartPreview extends Start {
  static drawPreviewWithBall(
    ctx: CanvasRenderingContext2D,
    point: Point,
    ballColor: string | null,
    countdown: number | null,
  ): void {
    const outerR = 18;
    const innerR = 12;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(point.x, point.y, outerR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(point.x, point.y, outerR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(point.x, point.y, innerR, 0, Math.PI * 2);
    ctx.stroke();

    if (ballColor) {
      ctx.fillStyle = ballColor;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (countdown !== null && countdown > 0) {
      ctx.fillStyle = "#000000";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(Math.ceil(countdown).toString(), point.x, point.y);
    }
  }
}
