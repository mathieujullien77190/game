import { POINT_SPACING } from "../constants"
import type { LinePoint } from "../types"
import { Token } from "./Token"

export class TokenPreview extends Token {
  startId: string = ""
  lineId: string = ""
  pointIndex: number = 0
  remainder: number = 0
  direction: 1 | -1 | 0 = 1
  startAt: number = 0
  currentSpeed: number = 0
  rotationOffset: number = 0
  targetRotationOffset: number = 0
  colorTransitionFrom: string = ""
  displayColor: string = ""
  colorProgress: number = 1
  opacity: number = 1
  arrived: boolean = false
  isPainting: boolean = false
  paintProgress: number = 0
  paintingLinkId: string = ""
  pendingLineId: string = ""
  pendingPointIndex: number = 0
  pendingDirection: 1 | -1 = 1
  pendingRemainder: number = 0

  advance = (deltaSeconds: number, pointCount: number): { hit: "start" | "end"; excess: number } | null => {
    let budget = Math.max(1, this.currentSpeed) * deltaSeconds + this.remainder
    const maxIndex = pointCount - 1
    while (budget >= POINT_SPACING) {
      budget -= POINT_SPACING
      const next = this.pointIndex + this.direction
      if (next > maxIndex) return { hit: "end", excess: budget }
      if (next < 0) return { hit: "start", excess: budget }
      this.pointIndex = next
    }
    this.remainder = budget
    return null
  }

  drawBoostTrail = (ctx: CanvasRenderingContext2D, speedDelta: number, points: LinePoint[]) => {
    if (speedDelta <= 0.5 || this.direction === 0) return
    const intensity = Math.min(speedDelta / 100, 1)
    const trailLen = Math.round(10 + 30 * intensity)
    for (let i = 1; i <= trailLen; i++) {
      const idx = this.pointIndex - this.direction * i
      if (idx < 0 || idx >= points.length) break
      const tpt = points[idx]
      const frac = 1 - i / (trailLen + 1)
      ctx.globalAlpha = frac * 0.55 * this.opacity
      ctx.fillStyle = this.displayColor || (this.color as string)
      ctx.beginPath()
      ctx.arc(tpt.x, tpt.y, 8 * frac * 0.75, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  draw = (ctx: CanvasRenderingContext2D, pt: LinePoint, speedDelta = 0, points?: LinePoint[]) => {
    if (points) this.drawBoostTrail(ctx, speedDelta, points)
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.displayColor || (this.color as string)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    if (this.type === "square") {
      const angle = (this.direction === -1 ? pt.angle + Math.PI : pt.angle) + this.rotationOffset
      ctx.save()
      ctx.translate(pt.x, pt.y)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.roundRect(-8, -8, 16, 16, 3)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    } else {
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }
}
