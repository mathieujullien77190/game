import type { Point } from "../types"
import { Inverter } from "./Inverter"

export class InverterPreview extends Inverter {
  draw = (ctx: CanvasRenderingContext2D, pt: Point, angle: number) => {
    const perp = angle + Math.PI / 2
    const len = 14
    ctx.save()
    ctx.translate(pt.x, pt.y)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(Math.cos(perp) * -len, Math.sin(perp) * -len)
    ctx.lineTo(Math.cos(perp) * len, Math.sin(perp) * len)
    ctx.stroke()
    ctx.restore()
  }
}
