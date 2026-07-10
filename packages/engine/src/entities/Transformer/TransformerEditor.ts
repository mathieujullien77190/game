import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { RADII } from "../../theme"
import { Transformer } from "./Transformer"

export const TYPE_COLOR: Record<string, string> = {
  fade: "#546e7a",
  rotate: "#00ACC1",
  color: "#7B1FA2",
  shape: "#2e7d32",
}

export class TransformerEditor extends Transformer {
  draw = (ctx: Renderer, pt: Point) => {
    ctx.fillStyle = TYPE_COLOR[this.type] ?? "#888"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, RADII.node, 0, Math.PI * 2)
    ctx.fill()
  }
}
