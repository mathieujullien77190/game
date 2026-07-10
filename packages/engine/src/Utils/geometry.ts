import type { Point } from "../types"
import type { Renderer } from "../render/Renderer"

export const pointsEqual = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y

export const distanceSq = (a: Point, b: Point): number => {
  const dx = a.x - b.x, dy = a.y - b.y
  return dx * dx + dy * dy
}

export const distance = (a: Point, b: Point): number => Math.sqrt(distanceSq(a, b))

// Triangle équilatéral centré sur (cx, cy), circumradius r, sommet "pointe" à l'angle `rotation`
// (0 = +x local). Trace le path complet (beginPath→closePath) ; l'appelant fait fill()/stroke().
export const traceTriangle = (ctx: Renderer, cx: number, cy: number, r: number, rotation = 0) => {
  const a0 = rotation
  const a1 = rotation + (Math.PI * 2) / 3
  const a2 = rotation - (Math.PI * 2) / 3
  ctx.beginPath()
  ctx.moveTo(cx + r * Math.cos(a0), cy + r * Math.sin(a0))
  ctx.lineTo(cx + r * Math.cos(a1), cy + r * Math.sin(a1))
  ctx.lineTo(cx + r * Math.cos(a2), cy + r * Math.sin(a2))
  ctx.closePath()
}
