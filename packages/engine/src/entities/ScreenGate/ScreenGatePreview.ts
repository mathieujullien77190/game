import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import type { Animation, AnimTime } from "../Animation"
import { ScreenGate } from "./ScreenGate"
import { GATE_W, GATE_H } from "./ScreenGateEditor"
import { CANVAS_W } from "../../constants"
import type { TokenPreview } from "../Token/TokenPreview"
import type { LinePreview } from "../Line/LinePreview"

const S = GATE_W / CANVAS_W

const fmtMult = (m: number) =>
  m >= 1 ? `×${Math.round(m * 10) / 10}` : `×${(Math.round(m * 10) / 10).toFixed(1)}`

export class ScreenGatePreview extends ScreenGate {
  timeMultiplier: number = 1

  constructor(linkId: string, targetScreenId: string, entryKey: string, exitKey: string, id?: string, screenId?: string) {
    super(linkId, id)
    this.targetScreenId = targetScreenId
    this.entryKey = entryKey
    this.exitKey = exitKey
    if (screenId) this.screenId = screenId
  }

  private _pt: Point | null = null
  private _tokens: TokenPreview[] = []
  private _lines: Record<string, LinePreview> = {}
  private _elapsed: number = 0

  drawEntry = (ctx: Renderer, pt: Point) => {
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  drawExit = (ctx: Renderer, pt: Point) => {
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  private drawStatic = (ctx: Renderer) => {
    if (!this._pt) return
    ctx.save()
    ctx.translate(this._pt.x, this._pt.y)
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(-GATE_W / 2, -GATE_H / 2, GATE_W, GATE_H, 5)
    ctx.fill()
    ctx.stroke()
    ctx.save()
    ctx.globalAlpha = 0.5
    ctx.fillStyle = "#000"
    ctx.font = "bold 10px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText(fmtMult(this.timeMultiplier), 0, -GATE_H / 2 + 3)
    ctx.restore()
    ctx.restore()
  }

  private animTokensInside = (ctx: Renderer, elapsed: number) => {
    if (!this._pt || this._tokens.length === 0) return
    ctx.save()
    ctx.translate(this._pt.x, this._pt.y)
    ctx.beginPath()
    ctx.roundRect(-GATE_W / 2, -GATE_H / 2, GATE_W, GATE_H, 5)
    ctx.clip()
    for (const token of this._tokens) {
      if (elapsed < token.startAt) continue
      const line = this._lines[token.lineId]
      if (!line || line.screenId !== this.targetScreenId) continue
      const tp = line.points[token.pointIndex]
      if (!tp) continue
      const dx = tp.x * S - GATE_W / 2
      const dy = tp.y * S - GATE_H / 2
      token.drawMini(ctx, dx, dy)
    }
    ctx.restore()
  }

  readonly animations: Animation[] = [
    { draw: (ctx, t) => this.animTokensInside(ctx, t.elapsed) },
  ]

  drawBefore = (_ctx: Renderer, _pt: Point, _tokens?: TokenPreview[], _lines?: Record<string, LinePreview>, _elapsed?: number) => {}

  drawAfter = (ctx: Renderer, pt: Point, tokens?: TokenPreview[], lines?: Record<string, LinePreview>, elapsed?: number) => {
    this._pt = pt
    this._tokens = tokens ?? []
    this._lines = lines ?? {}
    this._elapsed = elapsed ?? 0
    const t: AnimTime = { elapsed: this._elapsed, now: Date.now() }
    this.drawStatic(ctx)
    for (const anim of this.animations) anim.draw(ctx, t)
  }
}
