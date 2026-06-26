import { Line } from "./Line"

export class LineEditor extends Line {
  drawId = (ctx: CanvasRenderingContext2D) => {
    let mx: number, my: number
    if (this.type === "curve") {
      mx = 0.125*this.start.x + 0.375*this.cp1.x + 0.375*this.cp2.x + 0.125*this.end.x
      my = 0.125*this.start.y + 0.375*this.cp1.y + 0.375*this.cp2.y + 0.125*this.end.y
    } else if (this.type === "sine" && this.points.length > 0) {
      const mid = this.points[Math.floor(this.points.length / 2)]
      mx = mid.x
      my = mid.y
    } else {
      mx = (this.start.x + this.end.x) / 2
      my = (this.start.y + this.end.y) / 2
    }
    ctx.font = "bold 10px monospace"
    ctx.fillStyle = "#333"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(this.id, mx, my - 10)
  }

  draw = (ctx: CanvasRenderingContext2D, hovered = false, showId = false) => {
    ctx.lineCap = "round"
    ctx.strokeStyle = hovered ? "#000" : "#999"
    ctx.lineWidth = hovered ? 3 : 2
    ctx.setLineDash([6, 5])
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
    ctx.stroke()
    ctx.setLineDash([])

    if (this.type === "curve") {
      ctx.strokeStyle = "#ccc"
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(this.start.x, this.start.y)
      ctx.lineTo(this.cp1.x, this.cp1.y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(this.end.x, this.end.y)
      ctx.lineTo(this.cp2.x, this.cp2.y)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = "#4caf50"
      ctx.beginPath()
      ctx.arc(this.cp1.x, this.cp1.y, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#9c27b0"
      ctx.beginPath()
      ctx.arc(this.cp2.x, this.cp2.y, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    if (this.type === "elbow") {
      const corner = this.flip
        ? { x: this.end.x, y: this.start.y }
        : { x: this.start.x, y: this.end.y }
      ctx.fillStyle = "#fff"
      ctx.strokeStyle = "#666"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(corner.x, corner.y, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    ctx.fillStyle = "#f9ab00"
    ctx.beginPath()
    ctx.arc(this.start.x, this.start.y, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#1a73e8"
    ctx.beginPath()
    ctx.arc(this.end.x, this.end.y, 7, 0, Math.PI * 2)
    ctx.fill()

    if (showId) this.drawId(ctx)
  }
}
