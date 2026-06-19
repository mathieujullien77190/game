import type { TokenInstance } from "engine/Simulation/types";
import type Line from "engine/Line";
import { Token } from "./Token";

export class TokenPreview extends Token {
  static drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  static drawSquare(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string): void {
    const half = 6;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.fillRect(-half, -half, half * 2, half * 2);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.strokeRect(-half, -half, half * 2, half * 2);
    ctx.restore();
  }

  static resolvePosition(token: TokenInstance, lines: Record<string, Line>): { x: number; y: number; angle: number } | null {
    const line = lines[token.lineId];
    if (!line || line.points.length === 0) return null;
    const { ptIdx, segOffset, direction } = token;
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
    const angle = direction === 1 ? (p1.a ?? 0) : (p1.a ?? 0) + Math.PI;
    return { x, y, angle };
  }
}
