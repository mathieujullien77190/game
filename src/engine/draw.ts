import Line from "./Line";
import type { Point } from "./types";
import { COLORS } from "./colors";

export const drawStartEditor = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  hovered = false,
): void => {
  const radius = hovered ? 13 : 10;
  ctx.fillStyle = COLORS.departure;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.departureBorder;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.stroke();
};

export const drawStartPreview = (
  ctx: CanvasRenderingContext2D,
  point: Point,
): void => {
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
  ctx.fill();
};

export const drawLineReal = (
  ctx: CanvasRenderingContext2D,
  line: Line,
): void => {
  if (line.points.length < 2) return;
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(line.points[0].x, line.points[0].y);
  for (let i = 1; i < line.points.length; i++) {
    ctx.lineTo(line.points[i].x, line.points[i].y);
  }
  ctx.stroke();
};

export const drawLinePoints = (
  ctx: CanvasRenderingContext2D,
  line: Line,
  highlighted = false,
): void => {
  ctx.fillStyle = "#111827";
  const radius = highlighted ? 2 : 1;
  for (const pt of line.points) {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
};

export const drawLineAnchors = (
  ctx: CanvasRenderingContext2D,
  line: Line,
): void => {
  ctx.lineWidth = 1;

  ctx.strokeStyle = COLORS.anchorStart;
  ctx.beginPath();
  ctx.arc(line.start.x, line.start.y, 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = COLORS.anchorEnd;
  ctx.beginPath();
  ctx.arc(line.end.x, line.end.y, 6, 0, Math.PI * 2);
  ctx.stroke();
};

export const drawCurveControl = (
  ctx: CanvasRenderingContext2D,
  line: Line,
): void => {
  if (!line.control) return;

  ctx.strokeStyle = "#c4b5fd";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(line.start.x, line.start.y);
  ctx.lineTo(line.control.x, line.control.y);
  ctx.lineTo(line.end.x, line.end.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "#a78bfa";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(line.control.x, line.control.y, 6, 0, Math.PI * 2);
  ctx.stroke();
};

export const drawPreviewLine = (
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
): void => {
  const preview = new Line("_preview", start, end);
  ctx.fillStyle = "#93c5fd";
  for (const pt of preview.points) {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 1, 0, Math.PI * 2);
    ctx.fill();
  }
};

export const drawCurvePreview = (
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  control: Point,
): void => {
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
};

export const drawHoverPoint = (
  ctx: CanvasRenderingContext2D,
  point: Point,
): void => {
  ctx.strokeStyle = "#9ca3af";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
  ctx.stroke();
};

export const drawPendingStart = (
  ctx: CanvasRenderingContext2D,
  point: Point,
): void => {
  ctx.strokeStyle = COLORS.anchorStart;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
  ctx.stroke();
};

export const drawPendingEnd = (
  ctx: CanvasRenderingContext2D,
  point: Point,
): void => {
  ctx.strokeStyle = COLORS.anchorEnd;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
  ctx.stroke();
};
