import type { Point } from "../types"
import { Start } from "./Start"

export class StartEditor extends Start {
  draw = (ctx: CanvasRenderingContext2D, pt: Point) => {
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.moveTo(pt.x - 4, pt.y - 6)
    ctx.lineTo(pt.x + 8, pt.y)
    ctx.lineTo(pt.x - 4, pt.y + 6)
    ctx.closePath()
    ctx.fill()
  }
}
