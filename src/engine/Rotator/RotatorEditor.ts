import type { Point } from "../types"
import { Rotator } from "./Rotator"

export class RotatorEditor extends Rotator {
  draw = (ctx: CanvasRenderingContext2D, pt: Point) => {
    ctx.fillStyle = "#00BCD4"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 18, 0, Math.PI * 2)
    ctx.fill()
  }
}
