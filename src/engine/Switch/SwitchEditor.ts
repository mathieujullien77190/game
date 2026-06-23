import type { Point } from "../types"
import { Switch } from "./Switch"

export class SwitchEditor extends Switch {
  constructor(id?: string, linkIds?: string[], activeLinkId?: string | null) {
    super(id, linkIds, activeLinkId)
  }

  draw = (ctx: CanvasRenderingContext2D, pt: Point) => {
    ctx.fillStyle = "#7c3aed"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 18, 0, Math.PI * 2)
    ctx.fill()
  }
}
