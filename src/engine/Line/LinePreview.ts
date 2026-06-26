import { Line } from "./Line"

export class LinePreview extends Line {
  lastSpeed: number | undefined = undefined
  private tracePath = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath()
    ctx.moveTo(this.start.x, this.start.y)
    if (this.type === "curve") {
      ctx.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.end.x, this.end.y)
    } else if (this.type === "sine") {
      for (let i = 1; i < this.points.length; i++) ctx.lineTo(this.points[i].x, this.points[i].y)
    } else if (this.type === "elbow") {
      ctx.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.end.x, this.end.y)
    } else {
      ctx.lineTo(this.end.x, this.end.y)
    }
  }

  drawBefore = (ctx: CanvasRenderingContext2D, elapsedSeconds = 0) => {
    this.drawGlow(ctx, elapsedSeconds)
    this.draw(ctx)
  }

  drawAfter = (ctx: CanvasRenderingContext2D, speed?: number, tokenColor?: string) => {
    const mid = this.points[Math.floor(this.points.length / 2)]
    if (!mid) return
    ctx.font = "bold 9px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    if (this.showSpeed) {
      const rw = 26, rh = 19
      const rx = mid.x - rw / 2, ry = mid.y - rh / 2
      ctx.save()
      ctx.fillStyle = tokenColor ?? "#fff"
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(rx, ry, rw, rh, 4)
      ctx.fill()
      ctx.stroke()
      if (speed !== undefined) this.lastSpeed = speed
      if (this.lastSpeed !== undefined) {
        ctx.fillStyle = "#000"
        ctx.fillText(Math.round(this.lastSpeed).toString(), mid.x, mid.y)
      }
      ctx.restore()
    }

    if (this.limitation !== 0) {
      const r = 11
      const ox = this.showSpeed ? r * 2 + 4 : 0
      ctx.save()
      ctx.fillStyle = "#fff"
      ctx.strokeStyle = "#e00"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(mid.x + ox, mid.y, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = "#000"
      ctx.fillText(this.limitation.toString(), mid.x + ox, mid.y)
      ctx.restore()
    }
  }

  drawGlow = (ctx: CanvasRenderingContext2D, elapsedSeconds = 0) => {
    if (this.boost === 0) return
    const pts = this.points
    if (pts.length < 2) return
    const total = pts.length
    const winSize = Math.max(2, Math.floor(total * 0.3))
    const cycle = total + winSize
    const rawOffset = Math.floor((elapsedSeconds * Math.abs(this.boost) * 4) % cycle) - winSize
    const tail = Math.max(rawOffset, 0)
    const head = Math.min(rawOffset + winSize, total - 1)
    if (tail >= head) return
    ctx.save()
    ctx.shadowColor = "rgba(255, 140, 0, 0.9)"
    ctx.shadowBlur = 12
    ctx.strokeStyle = "rgba(255, 140, 0, 0.8)"
    ctx.lineWidth = 2
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
