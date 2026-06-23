import { Line } from "./Line"

export class LinePreview extends Line {
  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(this.start.x, this.start.y)
    if (this.type === "curve") {
      ctx.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.end.x, this.end.y)
    } else {
      ctx.lineTo(this.end.x, this.end.y)
    }
    ctx.stroke()
  }
}
