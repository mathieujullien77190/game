import type { BallInstance } from "engine/Simulation/types";
import type Line from "engine/Line";
import { Ball } from "./Ball";

export class BallPreview extends Ball {
  static drawAll(ctx: CanvasRenderingContext2D, active: BallInstance[], lines: Record<string, Line>): void {
    for (const ball of active) {
      const line = lines[ball.lineId];
      if (!line || line.points.length === 0) continue;
      const { ptIdx, segOffset, direction } = ball;
      const segIdx = direction === 1 ? ptIdx : ptIdx - 1;
      const p1 = line.points[ptIdx];
      const neighbor = direction === 1 ? line.points[ptIdx + 1] : line.points[ptIdx - 1];
      const segLen = line.segments[segIdx];
      let x: number;
      let y: number;
      if (neighbor && segLen && segLen > 0) {
        const t = segOffset / segLen;
        x = p1.x + (neighbor.x - p1.x) * t;
        y = p1.y + (neighbor.y - p1.y) * t;
      } else {
        x = p1.x;
        y = p1.y;
      }
      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
}
