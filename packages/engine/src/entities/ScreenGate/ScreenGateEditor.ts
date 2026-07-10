import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { COLORS, STROKE_WIDTHS } from "../../theme"
import { ScreenGate } from "./ScreenGate"

export const GATE_W = 36
export const GATE_H = 64

export const drawGateShape = (ctx: Renderer, pt: Point) => {
  ctx.save()
  ctx.translate(pt.x, pt.y)

  ctx.fillStyle = COLORS.white
  ctx.strokeStyle = COLORS.black
  ctx.lineWidth = STROKE_WIDTHS.base
  ctx.beginPath()
  ctx.roundRect(-GATE_W / 2, -GATE_H / 2, GATE_W, GATE_H, 5)
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

export class ScreenGateEditor extends ScreenGate {
  draw = (ctx: Renderer, pt: Point) => drawGateShape(ctx, pt)
}
