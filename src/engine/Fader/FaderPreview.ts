import type { Point } from "../types"
import { Fader } from "./Fader"

export class FaderPreview extends Fader {
  draw = (ctx: CanvasRenderingContext2D, pt: Point) => {
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
}
