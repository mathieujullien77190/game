import type { Point } from "../types"
import { Painter } from "./Painter"

export class PainterPreview extends Painter {
  paintProgress: number = -1
  currentTokenColor: string = ""

  draw = (ctx: CanvasRenderingContext2D, pt: Point, elapsedSeconds: number) => {
    ctx.save()
    ctx.translate(pt.x, pt.y)

    ctx.strokeStyle = "#bbb"
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(0, 0, 18, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    if (this.paintProgress > 0) {
      const turns = 6
      const steps = 32 * turns
      ctx.lineWidth = 4
      ctx.lineCap = "butt"
      for (let i = 0; i < steps; i++) {
        const t0 = i / steps
        const t1 = (i + 1) / steps
        if (t1 > this.paintProgress) break
        const a0 = Math.PI / 4 + t0 * Math.PI * 2 * turns
        const a1 = Math.PI / 4 + t1 * Math.PI * 2 * turns
        ctx.globalAlpha = t0 / this.paintProgress
        ctx.strokeStyle = this.currentTokenColor || this.color
        ctx.beginPath()
        ctx.arc(0, 0, 18, a0, a1)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    const dotAngle = this.paintProgress >= 0
      ? Math.PI / 4 + this.paintProgress * Math.PI * 2 * 6
      : Math.PI / 4 + elapsedSeconds * 0.4
    ctx.fillStyle = "#111"
    ctx.beginPath()
    ctx.arc(Math.cos(dotAngle) * 18, Math.sin(dotAngle) * 18, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = this.color
    ctx.strokeStyle = "#111"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }
}
