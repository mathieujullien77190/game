import type { Point } from "engine/types";
import { COLORS } from "engine/colors";

export const drawArrivalEditor = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  hovered = false,
): void => {
  const radius = hovered ? 13 : 10;
  ctx.fillStyle = COLORS.arrival;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.arrivalBorder;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.stroke();
};

export const drawArrivalPreview = (
  ctx: CanvasRenderingContext2D,
  point: Point,
): void => {
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
  ctx.stroke();
};
