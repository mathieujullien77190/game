import type { Point } from "../types"
import { Arrival } from "./Arrival"

const drawDemandToken = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, type: string, angled: boolean) => {
  ctx.fillStyle = color
  ctx.strokeStyle = "#000"
  ctx.lineWidth = 2
  if (type === "square") {
    ctx.save()
    ctx.translate(x, y)
    if (angled) ctx.rotate(Math.PI / 4)
    ctx.beginPath()
    ctx.roundRect(-8, -8, 16, 16, 3)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  } else {
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
}

export class ArrivalPreview extends Arrival {
  currentDemandIndex: number = 0
  fadeAlpha: number = 1
  isFading: boolean = false

  draw = (ctx: CanvasRenderingContext2D, pt: Point) => {
    ctx.save()
    ctx.translate(pt.x, pt.y)

    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(0, 0, 14, 0, Math.PI * 2)
    ctx.stroke()

    const demand = this.demands[this.currentDemandIndex]
    if (demand) {
      ctx.globalAlpha = this.fadeAlpha
      drawDemandToken(ctx, 0, 0, demand.color, demand.type, demand.angled)
      ctx.globalAlpha = 1
    }

    ctx.restore()
  }
}
