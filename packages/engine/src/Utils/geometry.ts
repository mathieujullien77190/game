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

// Polygone régulier à n côtés (n=3 triangle, n=4 carré), déphasage φ = position du 1er sommet.
// square: φ=π/4 place les sommets à 45°/135°/225°/315° → arêtes face à 0°/90°/180°/270°,
// reproduit exactement l'orientation du carré axis-aligned dessiné ailleurs (roundRect centré).
// triangle: φ=0 place un sommet à 0° → pointe en avant, cf. traceTriangle.
// round (n non fourni) : rayon constant.
export const shapeRadiusAt = (type: string, theta: number, r: number): number => {
  const n = type === "square" ? 4 : type === "triangle" ? 3 : 0
  if (n === 0) return r
  const phi = type === "square" ? Math.PI / 4 : 0
  const m = (Math.PI * 2) / n
  const a = r * Math.cos(Math.PI / n)
  const thetaM = (((theta - phi) % m) + m) % m
  return a / Math.cos(thetaM - m / 2)
}

// Trace le contour interpolé entre la forme `fromType` (rayon `rFrom`) et `toType` (rayon `rTo`)
// à la fraction `t` (0..1), en échantillonnant `segments` points régulièrement espacés en angle —
// la "déformation" du transformer shape (voir Token/CLAUDE.md), à la place d'un fade entre deux
// formes superposées. rFrom/rTo séparés car les formes n'ont pas toutes le même rayon d'affichage
// (ex: le triangle est dessiné un peu plus grand que round/square, cf. Token/CLAUDE.md).
export const traceShapeMorph = (
  ctx: Renderer,
  cx: number,
  cy: number,
  fromType: string,
  toType: string,
  rFrom: number,
  rTo: number,
  t: number,
  rotation = 0,
  segments = 40,
) => {
  ctx.beginPath()
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    const rf = shapeRadiusAt(fromType, theta, rFrom)
    const rt = shapeRadiusAt(toType, theta, rTo)
    const rr = rf + (rt - rf) * t
    const worldTheta = theta + rotation
    const x = cx + rr * Math.cos(worldTheta)
    const y = cy + rr * Math.sin(worldTheta)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}
