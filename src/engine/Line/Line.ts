import { POINT_SPACING } from "../constants"
import type { Point, LinePoint } from "../types"

export type LineType = "straight" | "curve"

let lineCounter = 0

export const syncLineCounter = (ids: string[]) => {
  let max = 0
  for (const id of ids) {
    const match = id.match(/^line([A-Z])$/)
    if (match) max = Math.max(max, match[1].charCodeAt(0) - 64)
    const numMatch = id.match(/^line(\d+)$/)
    if (numMatch) max = Math.max(max, 26 + parseInt(numMatch[1]))
  }
  lineCounter = max
}

const generateLineId = () => {
  const n = lineCounter++
  if (n < 26) return `line${String.fromCharCode(65 + n)}`
  return `line${n - 25}`
}

export class Line {
  id: string
  type: LineType
  start: Point
  end: Point
  cp1: Point
  cp2: Point
  points: LinePoint[] = []

  constructor(start: Point, end: Point, type: LineType = "straight", id?: string, cp1?: Point, cp2?: Point) {
    this.id = id ?? generateLineId()
    this.type = type
    this.start = { ...start }
    this.end = { ...end }
    const dx = end.x - start.x
    const dy = end.y - start.y
    this.cp1 = cp1 ?? { x: start.x + dx / 3, y: start.y + dy / 3 }
    this.cp2 = cp2 ?? { x: start.x + (2 * dx) / 3, y: start.y + (2 * dy) / 3 }
    this.computePoints()
  }

  computePoints = () => {
    if (this.type === "straight") {
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
    } else {
      const { x: sx, y: sy } = this.start
      const { x: ex, y: ey } = this.end
      const { x: c1x, y: c1y } = this.cp1
      const { x: c2x, y: c2y } = this.cp2

      const N = 300
      const sampledX = new Float64Array(N + 1)
      const sampledY = new Float64Array(N + 1)
      for (let i = 0; i <= N; i++) {
        const t = i / N
        const mt = 1 - t
        sampledX[i] = mt*mt*mt*sx + 3*mt*mt*t*c1x + 3*mt*t*t*c2x + t*t*t*ex
        sampledY[i] = mt*mt*mt*sy + 3*mt*mt*t*c1y + 3*mt*t*t*c2y + t*t*t*ey
      }

      const arcLengths = new Float64Array(N + 1)
      for (let i = 1; i <= N; i++) {
        const dx = sampledX[i] - sampledX[i - 1]
        const dy = sampledY[i] - sampledY[i - 1]
        arcLengths[i] = arcLengths[i - 1] + Math.sqrt(dx * dx + dy * dy)
      }
      const totalLength = arcLengths[N]
      const count = Math.max(1, Math.floor(totalLength / POINT_SPACING))

      this.points = Array.from({ length: count + 1 }, (_, i) => {
        const targetLen = (i / count) * totalLength
        let lo = 0, hi = N
        while (lo < hi - 1) {
          const mid = (lo + hi) >> 1
          if (arcLengths[mid] < targetLen) lo = mid
          else hi = mid
        }
        const span = arcLengths[hi] - arcLengths[lo]
        const frac = span === 0 ? 0 : (targetLen - arcLengths[lo]) / span
        const t = (lo + frac) / N
        const mt = 1 - t
        const x = mt*mt*mt*sx + 3*mt*mt*t*c1x + 3*mt*t*t*c2x + t*t*t*ex
        const y = mt*mt*mt*sy + 3*mt*mt*t*c1y + 3*mt*t*t*c2y + t*t*t*ey
        const tdx = 3*mt*mt*(c1x - sx) + 6*mt*t*(c2x - c1x) + 3*t*t*(ex - c2x)
        const tdy = 3*mt*mt*(c1y - sy) + 6*mt*t*(c2y - c1y) + 3*t*t*(ey - c2y)
        return { x, y, angle: Math.atan2(tdy, tdx) }
      })
    }
  }
}
