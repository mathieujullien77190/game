import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { COLORS, STROKE_WIDTHS, RADII } from "../../theme"
import { Arrival } from "./Arrival"
import { traceDemandShape } from "./demandShape"

const drawDemandToken = (ctx: Renderer, x: number, y: number, color: string, type: string, angled: boolean) => {
  ctx.fillStyle = color
  ctx.strokeStyle = COLORS.black
  ctx.lineWidth = STROKE_WIDTHS.base
  traceDemandShape(ctx, x, y, type, angled)
  ctx.fill()
  ctx.stroke()
}

export const drawArrivalEmptyShape = (ctx: Renderer, pt: Point) => {
  ctx.fillStyle = COLORS.black
  ctx.beginPath()
  ctx.arc(pt.x, pt.y, RADII.entityDot, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = COLORS.white
  ctx.fillRect(pt.x - 5, pt.y - 5, 10, 10)
}

export class ArrivalEditor extends Arrival {
  draw = (ctx: Renderer, pt: Point) => {
    if (this.demands.length === 0) {
      drawArrivalEmptyShape(ctx, pt)
      return
    }

    ctx.fillStyle = COLORS.black
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, RADII.entityDot, 0, Math.PI * 2)
    ctx.fill()
    drawDemandToken(ctx, pt.x, pt.y, this.demands[0].color, this.demands[0].type, this.demands[0].angled)
  }
}
