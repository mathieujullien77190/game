import type { Point } from "engine/types";
import type Line from "engine/Line";
import { FPS } from "engine/constants";
import { Switch } from "./Switch";
import type { SwitchAnim } from "./Switch";

export class SwitchPreview extends Switch {
  drawPreview(
    ctx: CanvasRenderingContext2D,
    point: Point,
    inputLine: Line | null,
    inputAnchor: "start" | "end" | null,
    targetLine: Line | null,
    targetAnchor: "start" | "end" | null,
  ): void {
    const R = 11;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(point.x, point.y, R, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);

    if (inputLine && inputAnchor) {
      const dx = inputAnchor === "end"
        ? inputLine.start.x - inputLine.end.x
        : inputLine.end.x - inputLine.start.x;
      const dy = inputAnchor === "end"
        ? inputLine.start.y - inputLine.end.y
        : inputLine.end.y - inputLine.start.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > 0) {
        ctx.beginPath();
        ctx.moveTo(point.x + (dx / len) * R, point.y + (dy / len) * R);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    }

    if (targetLine && targetAnchor) {
      const dx = targetAnchor === "start"
        ? targetLine.end.x - targetLine.start.x
        : targetLine.start.x - targetLine.end.x;
      const dy = targetAnchor === "start"
        ? targetLine.end.y - targetLine.start.y
        : targetLine.start.y - targetLine.end.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > 0) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(point.x + (dx / len) * R, point.y + (dy / len) * R);
        ctx.stroke();
      }
    }

    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(point.x, point.y, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawAnim(
    ctx: CanvasRenderingContext2D,
    anim: SwitchAnim,
    point: Point,
    lines: Record<string, Line>,
  ): void {
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

    if (this.input) {
      const inLine = lines[this.input.id];
      if (inLine) {
        const dx = this.input.anchor === "end"
          ? inLine.start.x - inLine.end.x
          : inLine.end.x - inLine.start.x;
        const dy = this.input.anchor === "end"
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
  }
}
