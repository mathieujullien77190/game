import type Line from "engine/Line";
import type { Switch } from "engine/Switch";
import type { Point } from "engine/types";
import { FPS } from "engine/constants";
import { SWITCH_ANIM_DURATION_MS } from "./constants";

export type SwitchAnim = { fromAngle: number; diff: number; t: number; duration: number };

export const drawSwitchAnim = (
  ctx: CanvasRenderingContext2D,
  anim: SwitchAnim,
  sw: Switch,
  point: Point,
  lines: Record<string, Line>,
): void => {
  anim.t = Math.min(1, anim.t + 1000 / (anim.duration * FPS));
  const angle = anim.fromAngle + anim.diff * anim.t;
  const R = 11;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(point.x, point.y, R, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);

  if (sw.inputLine) {
    const inLine = lines[sw.inputLine.id];
    if (inLine) {
      const dx = sw.inputLine.anchor === "end"
        ? inLine.start.x - inLine.end.x
        : inLine.end.x - inLine.start.x;
      const dy = sw.inputLine.anchor === "end"
        ? inLine.start.y - inLine.end.y
        : inLine.end.y - inLine.start.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > 0) {
        ctx.beginPath();
        ctx.moveTo(point.x + (dx / len) * R, point.y + (dy / len) * R);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    }
  }

  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(point.x + Math.cos(angle) * R, point.y + Math.sin(angle) * R);
  ctx.stroke();

  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(point.x, point.y, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
  ctx.fill();
};
