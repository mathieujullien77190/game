import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import type { Animation, AnimTime } from "../Animation"
import { Inverter } from "./Inverter"

const DOT_R = 5
const DOT_GAP = 14

export class InverterPreview extends Inverter {
  active: boolean = false

  private _pt: Point | null = null
  private _angle: number = 0

  private drawStatic = (_ctx: Renderer) => {}

  private animDots = (ctx: Renderer) => {
    if (!this._pt) return
    const perp = this._angle + Math.PI / 2
    const ox = Math.cos(perp) * DOT_GAP
    const oy = Math.sin(perp) * DOT_GAP
    ctx.save()
    ctx.translate(this._pt.x, this._pt.y)
    ctx.setLineDash([])
    ctx.fillStyle = "#e53935"
    ctx.globalAlpha = this.active ? 0.1 : 1
    ctx.beginPath()
    ctx.arc(-ox, -oy, DOT_R, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#4caf50"
    ctx.globalAlpha = this.active ? 1 : 0.1
    ctx.beginPath()
    ctx.arc(ox, oy, DOT_R, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.restore()
  }

  readonly animations: Animation[] = [
    { draw: (ctx, _t) => this.animDots(ctx) },
  ]

  drawBefore = (_ctx: Renderer, _pt: Point, _angle: number) => {}

  drawAfter = (ctx: Renderer, pt: Point, angle: number) => {
    this._pt = pt
    this._angle = angle
    const t: AnimTime = { elapsed: 0, now: Date.now() }
    this.drawStatic(ctx)
    for (const anim of this.animations) anim.draw(ctx, t)
  }
}
