import type { Renderer } from "../render/Renderer"
import type { Point } from "../types"
import { Switch } from "./Switch"

export class SwitchEditor extends Switch {
  constructor(id?: string, linkIds?: string[], activeLinkId?: string | null, screenId?: string) {
    super(id, linkIds, activeLinkId, screenId)
  }

  draw = (ctx: Renderer, pt: Point) => {
    ctx.fillStyle = "#7c3aed"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 18, 0, Math.PI * 2)
    ctx.fill()
  }
}
