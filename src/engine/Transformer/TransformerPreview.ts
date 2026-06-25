import type { Point } from "../types"
import { Transformer } from "./Transformer"

export class TransformerPreview extends Transformer {
  transformProgress: number = -1
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

    if (this.mode === "color" && this.transformProgress > 0) {
      const turns = 6
      const steps = 32 * turns
      ctx.lineWidth = 4
      ctx.lineCap = "butt"
      for (let i = 0; i < steps; i++) {
        const t0 = i / steps
        const t1 = (i + 1) / steps
        if (t1 > this.transformProgress) break
        const a0 = Math.PI / 4 + t0 * Math.PI * 2 * turns
        const a1 = Math.PI / 4 + t1 * Math.PI * 2 * turns
        ctx.globalAlpha = t0 / this.transformProgress
        ctx.strokeStyle = this.currentTokenColor || this.color
        ctx.beginPath()
        ctx.arc(0, 0, 18, a0, a1)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    const dotAngle = this.transformProgress >= 0
      ? Math.PI / 4 + this.transformProgress * Math.PI * 2 * 6
      : Math.PI / 4 + elapsedSeconds * 0.4
    ctx.fillStyle = "#111"
    ctx.beginPath()
    ctx.arc(Math.cos(dotAngle) * 18, Math.sin(dotAngle) * 18, 3, 0, Math.PI * 2)
    ctx.fill()

    if (this.mode === "color") {
      ctx.fillStyle = this.color
      ctx.strokeStyle = "#111"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.fillStyle = "#fff"
      ctx.strokeStyle = "#111"
      ctx.lineWidth = 2
      ctx.beginPath()
      if (this.targetType === "square") {
        ctx.roundRect(-5, -5, 10, 10, 2)
      } else {
        ctx.arc(0, 0, 5, 0, Math.PI * 2)
      }
      ctx.fill()
      ctx.stroke()
    }

    ctx.restore()
  }
}
