import { CANVAS_H } from "./constants"

export const smoothFps = (currentFps: number, deltaMs: number): number =>
  currentFps * 0.9 + (1000 / deltaMs) * 0.1

export const drawStats = (ctx: CanvasRenderingContext2D, fps: number, frameMs: number): void => {
  ctx.font = "bold 11px monospace"
  ctx.fillStyle = "#333"
  ctx.textAlign = "left"
  ctx.textBaseline = "bottom"
  ctx.fillText(`${Math.round(fps)} fps  ${Math.ceil(frameMs)}ms`, 8, CANVAS_H - 8)
}
