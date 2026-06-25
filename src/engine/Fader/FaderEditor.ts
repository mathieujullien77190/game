import type { Point } from "../types"
import { Fader } from "./Fader"

export class FaderEditor extends Fader {
  draw = (ctx: CanvasRenderingContext2D, pt: Point) => {
    ctx.save()
    ctx.translate(pt.x, pt.y)
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(0, 0, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}
