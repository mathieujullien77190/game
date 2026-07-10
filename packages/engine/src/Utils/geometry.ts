import type { Point } from "../types"

export const pointsEqual = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y

export const distanceSq = (a: Point, b: Point): number => {
  const dx = a.x - b.x, dy = a.y - b.y
  return dx * dx + dy * dy
}

export const distance = (a: Point, b: Point): number => Math.sqrt(distanceSq(a, b))
