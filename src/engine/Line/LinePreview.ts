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

  drawGlow = (ctx: CanvasRenderingContext2D, elapsedSeconds = 0) => {
    if (this.boost === 0) return
    const pts = this.points
    if (pts.length < 2) return
    const total = pts.length
    const winSize = Math.max(2, Math.floor(total * 0.3))
    const offset = Math.floor((elapsedSeconds * Math.abs(this.boost)) % total)
    ctx.save()
    ctx.shadowColor = "rgba(255, 140, 0, 0.9)"
    ctx.shadowBlur = 12
    ctx.strokeStyle = "rgba(255, 140, 0, 0.8)"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.setLineDash([])
    if (offset + winSize >= total) { ctx.restore(); return }
    ctx.beginPath()
    ctx.moveTo(pts[offset].x, pts[offset].y)
    for (let i = 1; i <= winSize; i++) ctx.lineTo(pts[offset + i].x, pts[offset + i].y)
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
