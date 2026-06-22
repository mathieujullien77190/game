import { Line } from "./Line"

export class LineEditor extends Line {
  drawId = (ctx: CanvasRenderingContext2D) => {
    const mx = (this.start.x + this.end.x) / 2
    const my = (this.start.y + this.end.y) / 2
    ctx.font = "bold 10px monospace"
    ctx.fillStyle = "#333"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(this.id, mx, my - 10)
  }

  draw = (ctx: CanvasRenderingContext2D, hovered = false, showId = false) => {
    ctx.lineCap = "round"

    ctx.strokeStyle = hovered ? "#555" : "#999"
    ctx.lineWidth = hovered ? 3 : 2
    ctx.setLineDash([6, 5])
    ctx.beginPath()
    ctx.moveTo(this.start.x, this.start.y)
    ctx.lineTo(this.end.x, this.end.y)
    ctx.stroke()
    ctx.setLineDash([])

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
