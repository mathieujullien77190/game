import type { Point } from "../types"
import { ScreenGate } from "./ScreenGate"

export const GATE_W = 36
export const GATE_H = 64

export class ScreenGateEditor extends ScreenGate {
  draw = (ctx: CanvasRenderingContext2D, pt: Point) => {
    ctx.save()
    ctx.translate(pt.x, pt.y)

    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(-GATE_W / 2, -GATE_H / 2, GATE_W, GATE_H, 5)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }
}
