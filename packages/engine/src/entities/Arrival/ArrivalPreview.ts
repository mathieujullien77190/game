import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { runAnimations, type Animation } from "../Animation"
import { COLORS, STROKE_WIDTHS, RADII } from "../../theme"
import { Arrival } from "./Arrival"
import { traceDemandShape } from "./demandShape"

const ARC_GAP = 0.05
const R = RADII.ring
const SW = STROKE_WIDTHS.bold
const QUEUE_COUNT = 3
const QUEUE_SPACING = 15
const QUEUE_START_OFFSET = R + 12

const QUEUE_VECTORS: Record<string, { x: number; y: number }> = {
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const drawDemandToken = (ctx: Renderer, x: number, y: number, color: string, type: string, angled: boolean, r = 8) => {
  ctx.fillStyle = color
  traceDemandShape(ctx, x, y, type, angled, r)
  ctx.fill()
}

export class ArrivalPreview extends Arrival {
  currentDemandIndex: number = 0
  fadeAlpha: number = 1
  isFading: boolean = false
  correctCount: number = 0
  arcFill: number = 0
  arcTarget: number = 0
  flashColor: string | null = null
  flashProgress: number = 0
  opacity: number = 1

  private _pt: Point | null = null

  private drawStatic = (ctx: Renderer) => {
    if (!this._pt) return
    ctx.save()
    ctx.translate(this._pt.x, this._pt.y)
    ctx.setLineDash([])
    ctx.globalAlpha = this.opacity
    ctx.strokeStyle = COLORS.grayLight
    ctx.lineWidth = SW
    ctx.beginPath()
    ctx.arc(0, 0, R, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  private animArcSegments = (ctx: Renderer) => {
    if (!this._pt || this.arcFill <= 0 || this.demands.length === 0) return
    const pt = this._pt
    const n = this.demands.length
    const lineAngle = (this.endpoint === "end" ? (pt.angle ?? 0) + Math.PI : pt.angle) ?? 0
    const segSpan = (Math.PI * 2) / n
    const gap = n > 1 ? ARC_GAP : 0
    const completedFull = Math.floor(this.arcFill)
    const partial = this.arcFill - completedFull
    ctx.save()
    ctx.translate(pt.x, pt.y)
    ctx.setLineDash([])
    ctx.globalAlpha = this.opacity
    ctx.strokeStyle = COLORS.gray
    ctx.lineWidth = SW
    ctx.lineCap = "round"
    for (let k = 0; k < n; k++) {
      const a0 = lineAngle + k * segSpan + gap / 2
      const a1 = lineAngle + (k + 1) * segSpan - gap / 2
      if (k < completedFull) {
        ctx.beginPath()
        ctx.arc(0, 0, R, a0, a1)
        ctx.stroke()
      } else if (k === completedFull && partial > 0) {
        ctx.beginPath()
        ctx.arc(0, 0, R, a0, a0 + (a1 - a0) * partial)
        ctx.stroke()
      }
    }
    ctx.restore()
  }

  private animFlashRing = (ctx: Renderer) => {
    if (!this._pt || !this.flashColor || this.flashProgress >= 1) return
    const pt = this._pt
    ctx.save()
    ctx.translate(pt.x, pt.y)
    ctx.setLineDash([])
    ctx.globalAlpha = (1 - this.flashProgress) * 0.55 * this.opacity
    ctx.strokeStyle = this.flashColor
    ctx.lineWidth = SW * 2
    ctx.beginPath()
    ctx.arc(0, 0, R + SW / 2, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  private animDemandFade = (ctx: Renderer) => {
    const demand = this.demands[this.currentDemandIndex]
    if (!demand || !this._pt) return
    const pt = this._pt
    ctx.save()
    ctx.translate(pt.x, pt.y)
    ctx.globalAlpha = this.fadeAlpha * this.opacity
    drawDemandToken(ctx, 0, 0, demand.color, demand.type, demand.angled)
    ctx.restore()
  }

  private animNextDemands = (ctx: Renderer) => {
    if (!this._pt || this.queueSide === "hidden") return
    const upcoming = this.demands.slice(this.currentDemandIndex + 1, this.currentDemandIndex + 1 + QUEUE_COUNT)
    if (upcoming.length === 0) return
    const pt = this._pt
    const v = QUEUE_VECTORS[this.queueSide]
    ctx.save()
    ctx.translate(pt.x, pt.y)
    upcoming.forEach((demand, i) => {
      const dist = QUEUE_START_OFFSET + i * QUEUE_SPACING
      ctx.globalAlpha = (0.85 - i * 0.2) * this.opacity
      drawDemandToken(ctx, v.x * dist, v.y * dist, demand.color, demand.type, demand.angled, 6)
    })
    ctx.restore()
  }

  readonly animations: Animation[] = [
    { draw: (ctx, _t) => this.animArcSegments(ctx) },
    { draw: (ctx, _t) => this.animFlashRing(ctx) },
    { draw: (ctx, _t) => this.animNextDemands(ctx) },
    { draw: (ctx, _t) => this.animDemandFade(ctx) },
  ]

  drawBefore = (_ctx: Renderer, pt: Point) => {
    this._pt = pt
  }

  drawAfter = (ctx: Renderer) => {
    if (!this._pt) return
    this.drawStatic(ctx)
    runAnimations(this.animations, ctx)
  }
}
