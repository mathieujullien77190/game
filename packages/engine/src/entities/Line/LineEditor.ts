import type { Renderer } from "../../render/Renderer"
import { COLORS, STROKE_WIDTHS } from "../../theme"
import { Line } from "./Line"

export class LineEditor extends Line {
  drawId = (ctx: Renderer) => {
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
    ctx.fillStyle = COLORS.ink
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(this.id, mx, my - 10)
  }

  // Path + décorations (contrôles curve, coin elbow) + id — pas les points start/end.
  // Séparé de drawStartPoint/drawEndPoint pour que l'ordre de superposition jaune/bleu
  // reste correct même entre deux lignes différentes partageant un endpoint (voir
  // EditorManager.drawAll : toutes les lignes sont d'abord tracées, puis tous les points
  // bleus (end), puis tous les points jaunes (start), en 3 passes globales).
  drawPath = (ctx: Renderer, hovered = false, showId = false) => {
    ctx.lineCap = "round"
    ctx.strokeStyle = hovered ? COLORS.black : COLORS.gray
    ctx.lineWidth = hovered ? STROKE_WIDTHS.medium : STROKE_WIDTHS.base
    ctx.setLineDash([6, 5])
    ctx.beginPath()
    ctx.moveTo(this.start.x, this.start.y)
    if (this.type === "curve") {
      ctx.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.end.x, this.end.y)
    } else if (this.type === "sine" || this.type === "spiral") {
      for (let i = 1; i < this.points.length; i++) ctx.lineTo(this.points[i].x, this.points[i].y)
    } else if (this.type === "elbow") {
      ctx.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.end.x, this.end.y)
    } else {
      ctx.lineTo(this.end.x, this.end.y)
    }
    ctx.stroke()
    ctx.setLineDash([])

    if (this.type === "curve") {
      ctx.strokeStyle = COLORS.grayLight
      ctx.lineWidth = STROKE_WIDTHS.hairline
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

      ctx.fillStyle = COLORS.green
      ctx.beginPath()
      ctx.arc(this.cp1.x, this.cp1.y, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = COLORS.cp2Purple
      ctx.beginPath()
      ctx.arc(this.cp2.x, this.cp2.y, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    if (this.type === "elbow") {
      const corner = this.flip
        ? { x: this.end.x, y: this.start.y }
        : { x: this.start.x, y: this.end.y }
      ctx.fillStyle = COLORS.white
      ctx.strokeStyle = COLORS.grayDark
      ctx.lineWidth = STROKE_WIDTHS.thin
      ctx.beginPath()
      ctx.arc(corner.x, corner.y, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    if (showId) this.drawId(ctx)
  }

  drawEndPoint = (ctx: Renderer) => {
    ctx.fillStyle = COLORS.blue
    ctx.beginPath()
    ctx.arc(this.end.x, this.end.y, 7, 0, Math.PI * 2)
    ctx.fill()
  }

  drawStartPoint = (ctx: Renderer) => {
    ctx.fillStyle = COLORS.amber
    ctx.beginPath()
    ctx.arc(this.start.x, this.start.y, 5, 0, Math.PI * 2)
    ctx.fill()
  }
}
