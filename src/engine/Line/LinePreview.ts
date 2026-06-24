import { MAX_BOOST } from "../constants"
import { Line } from "./Line"

export class LinePreview extends Line {
  private tracePath = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath()
    ctx.moveTo(this.start.x, this.start.y)
    if (this.type === "curve") {
      ctx.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.end.x, this.end.y)
    } else if (this.type === "sine") {
      for (let i = 1; i < this.points.length; i++) ctx.lineTo(this.points[i].x, this.points[i].y)
    } else {
      ctx.lineTo(this.end.x, this.end.y)
    }
  }

  drawGlow = (ctx: CanvasRenderingContext2D) => {
    if (this.boost === 0) return
    const intensity = Math.min(Math.abs(this.boost) / MAX_BOOST, 1)
    const r = this.boost > 0 ? 255 : Math.round(120 - 90 * intensity)
    const g = this.boost > 0 ? Math.round(180 * (1 - intensity)) : Math.round(170 - 110 * intensity)
    const b = this.boost > 0 ? 0 : 255
    ctx.save()
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.9)`
    ctx.shadowBlur = 6 + intensity * 14
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.55 + intensity * 0.35})`
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.setLineDash([])
    this.tracePath(ctx)
    ctx.stroke()
    ctx.restore()
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.setLineDash([])
    this.tracePath(ctx)
    ctx.stroke()
  }
}
