import { POINT_SPACING } from "../constants"
import type { Point, LinePoint } from "../types"

let lineCounter = 0

const generateLineId = () => {
  const n = lineCounter++
  if (n < 26) return `line${String.fromCharCode(65 + n)}`
  return `line${n - 25}`
}

export class Line {
  id: string
  start: Point
  end: Point
  points: LinePoint[] = []

  constructor(start: Point, end: Point, id?: string) {
    this.id = id ?? generateLineId()
    this.start = { ...start }
    this.end = { ...end }
    this.computePoints()
  }

  computePoints = () => {
    const dx = this.end.x - this.start.x
    const dy = this.end.y - this.start.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const count = Math.max(1, Math.floor(length / POINT_SPACING))
    const angle = Math.atan2(dy, dx)
    this.points = Array.from({ length: count + 1 }, (_, i) => ({
      x: this.start.x + (dx * i) / count,
      y: this.start.y + (dy * i) / count,
      angle,
    }))
  }
}
