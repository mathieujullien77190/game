import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { COLORS, RADII } from "../../theme"
import { Cloner } from "./Cloner"

export const drawClonerShape = (ctx: Renderer, pt: Point) => {
  ctx.fillStyle = COLORS.clonerGhost
  ctx.beginPath()
  ctx.arc(pt.x, pt.y, RADII.node, 0, Math.PI * 2)
  ctx.fill()
}

export class ClonerEditor extends Cloner {
  draw = (ctx: Renderer, pt: Point) => drawClonerShape(ctx, pt)
}
