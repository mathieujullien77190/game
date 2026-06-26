import type { Point } from "../types"
import { ScreenGate } from "./ScreenGate"
import { GATE_W, GATE_H } from "./ScreenGateEditor"
import { CANVAS_W } from "../constants"
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

  draw = (ctx: CanvasRenderingContext2D, pt: Point, tokens?: TokenPreview[], lines?: Record<string, LinePreview>, elapsed?: number) => {
    ctx.save()
    ctx.translate(pt.x, pt.y)

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

    if (tokens && lines && elapsed !== undefined) {
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(-GATE_W / 2, -GATE_H / 2, GATE_W, GATE_H, 5)
      ctx.clip()
      for (const token of tokens) {
        if (elapsed < token.startAt) continue
        const line = lines[token.lineId]
        if (!line || line.screenId !== this.targetScreenId) continue
        const tp = line.points[token.pointIndex]
        if (!tp) continue
        const dx = tp.x * S - GATE_W / 2
        const dy = tp.y * S - GATE_H / 2
        const color = (token.displayColor || token.color) as string
        ctx.fillStyle = color
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 0.5
        if (token.type === "square") {
          ctx.beginPath()
          ctx.rect(dx - 2, dy - 2, 4, 4)
          ctx.fill()
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(dx, dy, 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }
      }
      ctx.restore()
    }

    ctx.restore()
  }
}
