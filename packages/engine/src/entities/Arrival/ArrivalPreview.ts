import type { Renderer } from "../../render/Renderer"
import type { LinePoint } from "../../types"
import type { Animation, AnimTime } from "../Animation"
import { Arrival } from "./Arrival"

const ARC_GAP = 0.05
const R = 17
const SW = 4

const drawDemandToken = (ctx: Renderer, x: number, y: number, color: string, type: string, angled: boolean) => {
  ctx.fillStyle = color
  if (type === "square") {
    ctx.save()
    ctx.translate(x, y)
    if (angled) ctx.rotate(Math.PI / 4)
    ctx.beginPath()
    ctx.roundRect(-8, -8, 16, 16, 3)
    ctx.fill()
    ctx.restore()
  } else {
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()
  }
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

  private _pt: LinePoint | null = null

  private drawStatic = (ctx: Renderer) => {
    if (!this._pt) return
    ctx.save()
    ctx.translate(this._pt.x, this._pt.y)
    ctx.setLineDash([])
    ctx.strokeStyle = "#ccc"
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
    const lineAngle = this.endpoint === "end" ? pt.angle + Math.PI : pt.angle
    const segSpan = (Math.PI * 2) / n
    const gap = n > 1 ? ARC_GAP : 0
    const completedFull = Math.floor(this.arcFill)
    const partial = this.arcFill - completedFull
    ctx.save()
    ctx.translate(pt.x, pt.y)
    ctx.setLineDash([])
    ctx.strokeStyle = "#999"
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
    ctx.globalAlpha = (1 - this.flashProgress) * 0.55
    ctx.strokeStyle = this.flashColor
    ctx.lineWidth = SW * 2
    ctx.beginPath()
    ctx.arc(0, 0, R + SW / 2, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.restore()
  }

  private animDemandFade = (ctx: Renderer) => {
    const demand = this.demands[this.currentDemandIndex]
    if (!demand || !this._pt) return
    const pt = this._pt
    ctx.save()
    ctx.translate(pt.x, pt.y)
    ctx.globalAlpha = this.fadeAlpha
    drawDemandToken(ctx, 0, 0, demand.color, demand.type, demand.angled)
    ctx.globalAlpha = 1
    ctx.restore()
  }

  readonly animations: Animation[] = [
    { draw: (ctx, _t) => this.animArcSegments(ctx) },
    { draw: (ctx, _t) => this.animFlashRing(ctx) },
    { draw: (ctx, _t) => this.animDemandFade(ctx) },
  ]

  drawAfter = (_ctx: Renderer, _pt: LinePoint) => {}

  drawBefore = (ctx: Renderer, pt: LinePoint) => {
    this._pt = pt
    const t: AnimTime = { elapsed: 0, now: Date.now() }
    this.drawStatic(ctx)
    for (const anim of this.animations) anim.draw(ctx, t)
  }
}
