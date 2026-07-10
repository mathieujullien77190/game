import type { Renderer } from "../../render/Renderer"
import type { LinePoint } from "../../types"
import type { Animation, AnimTime } from "../Animation"
import { Start } from "./Start"

const R = 20

export class StartPreview extends Start {
  private _pt: LinePoint | null = null
  private _remaining: number = 0
  private _tokenColor: string | undefined = undefined
  private _refDelay: number | undefined = undefined

  prepareFrame = (pt: LinePoint, remaining: number, tokenColor?: string, refDelay?: number) => {
    this._pt = pt
    this._remaining = remaining
    this._tokenColor = tokenColor
    this._refDelay = refDelay
  }

  private drawStatic = (ctx: Renderer) => {
    const pt = this._pt
    if (!pt) return
    ctx.setLineDash([])
    ctx.lineWidth = 5
    ctx.strokeStyle = "#999"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, R, 0, Math.PI * 2)
    ctx.stroke()
  }

  private animCountdownArc = (ctx: Renderer) => {
    const pt = this._pt
    if (!pt || this._remaining <= 0 || this.delay === 0) return
    const progress = 1 - this._remaining / (this._refDelay ?? this.delay)
    if (progress <= 0) return
    const angle = this.endpoint === "end" ? pt.angle + Math.PI : pt.angle
    ctx.setLineDash([])
    ctx.lineWidth = 4
    ctx.strokeStyle = this._tokenColor ?? "#999"
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, R, angle, angle + progress * Math.PI * 2)
    ctx.stroke()
  }

  readonly animations: Animation[] = [
    { draw: (ctx, _t) => this.animCountdownArc(ctx) },
  ]

  drawBefore = (_ctx: Renderer) => {}

  drawAfter = (ctx: Renderer) => {
    if (!this._pt) return
    const t: AnimTime = { elapsed: 0, now: Date.now() }
    this.drawStatic(ctx)
    for (const anim of this.animations) anim.draw(ctx, t)
  }
}
