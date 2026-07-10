import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { COLORS, RADII } from "../../theme"
import { Start } from "./Start"

export const drawStartShape = (ctx: Renderer, pt: Point) => {
  ctx.fillStyle = COLORS.black
  ctx.beginPath()
  ctx.arc(pt.x, pt.y, RADII.entityDot, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = COLORS.white
  ctx.beginPath()
  ctx.moveTo(pt.x - 4, pt.y - 6)
  ctx.lineTo(pt.x + 8, pt.y)
  ctx.lineTo(pt.x - 4, pt.y + 6)
  ctx.closePath()
  ctx.fill()
}

export class StartEditor extends Start {
  draw = (ctx: Renderer, pt: Point) => drawStartShape(ctx, pt)
}
