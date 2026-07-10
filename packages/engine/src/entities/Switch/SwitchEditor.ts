import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { COLORS, RADII } from "../../theme"
import { Switch } from "./Switch"

export const drawSwitchShape = (ctx: Renderer, pt: Point) => {
  ctx.fillStyle = COLORS.switchGhost
  ctx.beginPath()
  ctx.arc(pt.x, pt.y, RADII.node, 0, Math.PI * 2)
  ctx.fill()
}

export class SwitchEditor extends Switch {
  draw = (ctx: Renderer, pt: Point) => drawSwitchShape(ctx, pt)
}
