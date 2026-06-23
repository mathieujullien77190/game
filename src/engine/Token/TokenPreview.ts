import type { LinePoint } from "../types"
import { Token } from "./Token"

export class TokenPreview extends Token {
  startId: string = ""
  lineId: string = ""
  pointIndex: number = 0
  remainder: number = 0
  direction: 1 | -1 | 0 = 1
  startAt: number = 0

  draw = (ctx: CanvasRenderingContext2D, pt: LinePoint) => {
    ctx.fillStyle = this.color
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    if (this.type === "square") {
      const angle = this.direction === -1 ? pt.angle + Math.PI : pt.angle
      ctx.save()
      ctx.translate(pt.x, pt.y)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.roundRect(-8, -8, 16, 16, 3)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    } else {
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }
  }
}
