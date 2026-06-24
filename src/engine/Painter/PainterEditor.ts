import type { Point } from "../types"
import { Painter } from "./Painter"

export class PainterEditor extends Painter {
  draw = (ctx: CanvasRenderingContext2D, pt: Point, hovered = false) => {
    ctx.fillStyle = "#e91e63"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 18, 0, Math.PI * 2)
    ctx.fill()

    if (hovered) {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(pt.x + 26, pt.y, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
