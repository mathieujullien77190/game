import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { runAnimations, type Animation } from "../Animation"
import { COLORS, STROKE_WIDTHS, RADII } from "../../theme"
import { Start } from "./Start"

const R = RADII.ring

export class StartPreview extends Start {
  opacity: number = 1

  private _pt: Point | null = null
  private _remaining: number = 0
  private _tokenColor: string | undefined = undefined
  private _refDelay: number | undefined = undefined

  prepareFrame = (pt: Point, remaining: number, tokenColor?: string, refDelay?: number) => {
    this._pt = pt
    this._remaining = remaining
    this._tokenColor = tokenColor
    this._refDelay = refDelay
  }

  private drawStatic = (ctx: Renderer) => {
    const pt = this._pt
    if (!pt) return
    ctx.setLineDash([])
    ctx.lineWidth = STROKE_WIDTHS.heavy
    ctx.strokeStyle = COLORS.gray
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, R, 0, Math.PI * 2)
    ctx.stroke()
  }

  private animCountdownArc = (ctx: Renderer) => {
    const pt = this._pt
    if (!pt || this._remaining <= 0 || this.delay === 0) return
    const progress = 1 - this._remaining / (this._refDelay ?? this.delay)
    if (progress <= 0) return
    const baseAngle = pt.angle ?? 0
    const angle = this.endpoint === "end" ? baseAngle + Math.PI : baseAngle
    ctx.setLineDash([])
    ctx.lineWidth = STROKE_WIDTHS.bold
    ctx.strokeStyle = this._tokenColor ?? COLORS.gray
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
    if (!this._pt || this.opacity <= 0) return
    ctx.globalAlpha = this.opacity
    this.drawStatic(ctx)
    runAnimations(this.animations, ctx)
    ctx.globalAlpha = 1
  }
}
