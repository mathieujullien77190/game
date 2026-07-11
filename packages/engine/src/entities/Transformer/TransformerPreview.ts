import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { COLORS, STROKE_WIDTHS, RADII } from "../../theme"
import { traceTriangle } from "../../Utils/geometry"
import { Transformer } from "./Transformer"

const ORBIT_R = RADII.ring
const TRAIL_SEGS = 12
const TRAIL_SPAN = Math.PI * 0.5

export class TransformerPreview extends Transformer {
  transformProgress: number = -1
  currentTokenColor: string = ""

  private _pt: Point | null = null
  private _elapsed: number = 0

  private dotAngle = (elapsedSeconds: number) =>
    this.transformProgress >= 0
      ? Math.PI / 4 + this.transformProgress * Math.PI * 2 * 6
      : Math.PI / 4 + elapsedSeconds * 0.4

  private orbitDot = (ctx: Renderer, angle: number) => {
    ctx.fillStyle = COLORS.gray
    ctx.beginPath()
    ctx.arc(Math.cos(angle) * ORBIT_R, Math.sin(angle) * ORBIT_R, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  private trailArcs = (ctx: Renderer, angle: number, stroke: string) => {
    if (this.transformProgress <= 0) return
    ctx.lineWidth = STROKE_WIDTHS.bold
    ctx.lineCap = "butt"
    for (let i = 0; i < TRAIL_SEGS; i++) {
      const a0 = angle - TRAIL_SPAN * (1 - i / TRAIL_SEGS)
      const a1 = angle - TRAIL_SPAN * (1 - (i + 1) / TRAIL_SEGS)
      ctx.globalAlpha = (i + 1) / TRAIL_SEGS
      ctx.strokeStyle = stroke
      ctx.beginPath()
      ctx.arc(0, 0, ORBIT_R, a0, a1)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  drawAfter = (ctx: Renderer) => {
    if (!this._pt) return
    ctx.save()
    ctx.translate(this._pt.x, this._pt.y)
    if (this.type === "rotate") {
      const r = 16
      ctx.strokeStyle = COLORS.grayLight
      ctx.lineWidth = STROKE_WIDTHS.heavy
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.rotate(this._elapsed * Math.PI * 1.4)
      ctx.strokeStyle = COLORS.grayDark
      ctx.lineWidth = STROKE_WIDTHS.transformerActive
      ctx.lineCap = "round"
      for (let i = 0; i < 3; i++) {
        const end = (i * Math.PI * 2) / 3 + Math.PI * 0.5
        const ax = r * Math.cos(end), ay = r * Math.sin(end)
        const backDir = end - Math.PI / 2
        const alen = 5, spread = 0.5
        ctx.beginPath()
        ctx.moveTo(ax + alen * Math.cos(backDir + spread), ay + alen * Math.sin(backDir + spread))
        ctx.lineTo(ax, ay)
        ctx.lineTo(ax + alen * Math.cos(backDir - spread), ay + alen * Math.sin(backDir - spread))
        ctx.stroke()
      }
    } else if (this.type === "color" || this.type === "shape" || this.type === "fade") {
      const angle = this.dotAngle(this._elapsed)
      const trailColor = this.type === "color" ? (this.currentTokenColor || this.color) as string : COLORS.gray
      ctx.strokeStyle = COLORS.grayLight
      ctx.lineWidth = STROKE_WIDTHS.heavy
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.arc(0, 0, ORBIT_R, 0, Math.PI * 2)
      ctx.stroke()
      this.trailArcs(ctx, angle, trailColor)
      this.orbitDot(ctx, angle)
    }
    ctx.restore()
  }

  drawBefore = (ctx: Renderer, pt: Point, elapsedSeconds: number, lineAngle = 0) => {
    this._pt = pt
    this._elapsed = elapsedSeconds
    ctx.save()
    ctx.translate(pt.x, pt.y)
    ctx.fillStyle = COLORS.white
    ctx.beginPath()
    ctx.arc(0, 0, this.type === "rotate" ? 16 : ORBIT_R, 0, Math.PI * 2)
    ctx.fill()
    if (this.type === "color") {
      ctx.fillStyle = this.color as string
      ctx.beginPath()
      ctx.arc(0, 0, 5, 0, Math.PI * 2)
      ctx.fill()
    } else if (this.type === "shape") {
      ctx.fillStyle = COLORS.gray
      if (this.targetType === "square") {
        ctx.save()
        ctx.rotate(lineAngle)
        ctx.beginPath()
        ctx.roundRect(-5, -5, 10, 10, 2)
        ctx.fill()
        ctx.restore()
      } else if (this.targetType === "triangle") {
        traceTriangle(ctx, 0, 0, 7, lineAngle)
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (this.type === "fade") {
      ctx.globalAlpha = this.amount
      ctx.fillStyle = COLORS.gray
      ctx.beginPath()
      ctx.arc(0, 0, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }
    ctx.restore()
  }
}
