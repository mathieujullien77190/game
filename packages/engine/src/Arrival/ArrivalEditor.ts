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

export class ArrivalEditor extends Arrival {
  draw = (ctx: CanvasRenderingContext2D, pt: Point) => {
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2)
    ctx.fill()

    if (this.demands.length === 0) {
      ctx.fillStyle = "#fff"
      ctx.fillRect(pt.x - 5, pt.y - 5, 10, 10)
      return
    }

    drawDemandToken(ctx, pt.x, pt.y, this.demands[0].color, this.demands[0].type, this.demands[0].angled)
  }
}
