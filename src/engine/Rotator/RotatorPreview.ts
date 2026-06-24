import type { Point } from "../types"
import { Rotator } from "./Rotator"

export class RotatorPreview extends Rotator {
  draw = (ctx: CanvasRenderingContext2D, pt: Point, elapsedSeconds: number) => {
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
}
