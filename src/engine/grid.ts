import type { Point } from "./types";

export const GRID_STEP = 20;

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let x = 0; x <= width; x += GRID_STEP) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += GRID_STEP) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
};

export const snapToGrid = (point: Point): Point => ({
  x: Math.round(point.x / GRID_STEP) * GRID_STEP,
  y: Math.round(point.y / GRID_STEP) * GRID_STEP,
});
