import type { Point } from "../types"
import { Transformer } from "./Transformer"

export class TransformerEditor extends Transformer {
  draw = (ctx: CanvasRenderingContext2D, pt: Point) => {
    ctx.save()
    ctx.translate(pt.x, pt.y)
    if (this.mode === "color") {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(0, 0, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#fff"
      ctx.beginPath()
      ctx.arc(0, 0, 5, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = "#2e7d32"
      ctx.beginPath()
      ctx.arc(0, 0, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#fff"
      ctx.beginPath()
      if (this.targetType === "square") {
        ctx.roundRect(-6, -6, 12, 12, 2)
      } else {
        ctx.arc(0, 0, 6, 0, Math.PI * 2)
      }
      ctx.fill()
    }
    ctx.restore()
  }
}
