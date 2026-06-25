import type { Point } from "../types"
import { Transformer } from "./Transformer"

export class TransformerPreview extends Transformer {
  transformProgress: number = -1
  currentTokenColor: string = ""

  draw = (ctx: CanvasRenderingContext2D, pt: Point, elapsedSeconds: number) => {
    if (this.type === "rotate") this.drawRotate(ctx, pt, elapsedSeconds)
    else if (this.type === "fade") this.drawFade(ctx, pt)
    else this.drawTransform(ctx, pt, elapsedSeconds)
  }

  private drawRotate = (ctx: CanvasRenderingContext2D, pt: Point, elapsedSeconds: number) => {
    const r = 10
    const arcSpan = Math.PI * 0.5
    const rotation = elapsedSeconds * Math.PI * 1.4

    ctx.save()
    ctx.translate(pt.x, pt.y)
    ctx.rotate(rotation)
    ctx.strokeStyle = "#111"
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.shadowBlur = 0

    for (let i = 0; i < 3; i++) {
      const start = (i * Math.PI * 2) / 3
      const end = start + arcSpan

      ctx.beginPath()
      ctx.arc(0, 0, r, start, end)
      ctx.stroke()

      const ax = r * Math.cos(end)
      const ay = r * Math.sin(end)
      const backDir = end - Math.PI / 2
      const alen = 4.5
      const spread = 0.5
      ctx.beginPath()
      ctx.moveTo(ax + alen * Math.cos(backDir + spread), ay + alen * Math.sin(backDir + spread))
      ctx.lineTo(ax, ay)
      ctx.lineTo(ax + alen * Math.cos(backDir - spread), ay + alen * Math.sin(backDir - spread))
      ctx.stroke()
    }

    ctx.restore()
  }

  private drawFade = (ctx: CanvasRenderingContext2D, pt: Point) => {
    ctx.save()
    ctx.translate(pt.x, pt.y)

    ctx.globalAlpha = Math.max(0.05, 1 - this.amount)
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(0, 0, 14, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalAlpha = 1
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, 14, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
  }

  private drawTransform = (ctx: CanvasRenderingContext2D, pt: Point, elapsedSeconds: number) => {
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

    if (this.type === "color" && this.transformProgress > 0) {
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

    if (this.type === "color") {
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
