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
    const cycle = total + winSize
    const rawOffset = Math.floor((elapsedSeconds * Math.abs(this.boost)) % cycle) - winSize
    const tail = Math.max(rawOffset, 0)
    const head = Math.min(rawOffset + winSize, total - 1)
    if (tail >= head) return
    ctx.save()
    ctx.shadowColor = "rgba(255, 140, 0, 0.9)"
    ctx.shadowBlur = 12
    ctx.strokeStyle = "rgba(255, 140, 0, 0.8)"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(pts[tail].x, pts[tail].y)
    for (let i = tail + 1; i <= head; i++) ctx.lineTo(pts[i].x, pts[i].y)
    ctx.stroke()
    ctx.restore()
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    if (this.tunnel) {
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.arc(this.start.x, this.start.y, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(this.end.x, this.end.y, 4, 0, Math.PI * 2)
      ctx.fill()
      return
    }
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.setLineDash([])
    this.tracePath(ctx)
    ctx.stroke()
  }
}
