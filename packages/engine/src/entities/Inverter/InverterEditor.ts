import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { COLORS, STROKE_WIDTHS } from "../../theme"
import { Inverter } from "./Inverter"

export const drawInverterShape = (ctx: Renderer, pt: Point, angle: number) => {
  const perp = angle + Math.PI / 2
  const len = 14
  ctx.save()
  ctx.translate(pt.x, pt.y)
  ctx.strokeStyle = COLORS.inverterAccent
  ctx.lineWidth = STROKE_WIDTHS.medium
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(Math.cos(perp) * -len, Math.sin(perp) * -len)
  ctx.lineTo(Math.cos(perp) * len, Math.sin(perp) * len)
  ctx.stroke()
  ctx.restore()
}

export class InverterEditor extends Inverter {
  draw = (ctx: Renderer, pt: Point, angle: number) => drawInverterShape(ctx, pt, angle)
}
