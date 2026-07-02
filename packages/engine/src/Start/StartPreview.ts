import type { LinePoint } from "../types"
import { Start } from "./Start"

export class StartPreview extends Start {
  draw = (ctx: CanvasRenderingContext2D, pt: LinePoint, remaining: number = 0) => {
    ctx.setLineDash([])
    ctx.lineWidth = 3
    const s = 14
    const angle = this.endpoint === "end" ? pt.angle + Math.PI : pt.angle

    if (remaining <= 0 || this.delay === 0) {
      ctx.strokeStyle = "#000"
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, s, 0, Math.PI * 2)
      ctx.stroke()
      return
    }

    const progress = 1 - remaining / this.delay

    ctx.strokeStyle = "#ddd"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, s, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = "#000"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, s, angle, angle + progress * Math.PI * 2)
    ctx.stroke()
  }
}
