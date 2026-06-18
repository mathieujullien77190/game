import type Line from "engine/Line";
import type { Point } from "engine/types";

export const drawSwitchEditor = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  _targetLine: Line | null,
  hovered = false,
): void => {
  const radius = hovered ? 18 : 14;
  ctx.fillStyle = "#6b7280";
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
};

export const drawSwitchPreview = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  inputLine: Line | null,
  inputAnchor: "start" | "end" | null,
  targetLine: Line | null,
  targetAnchor: "start" | "end" | null,
): void => {
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
};
