import type { Point } from "../types"
import { ScreenGate } from "./ScreenGate"
import { GATE_W, GATE_H } from "./ScreenGateEditor"

export class ScreenGatePreview extends ScreenGate {
  constructor(linkId: string, targetScreenId: string, entryKey: string, exitKey: string, id?: string, screenId?: string) {
    super(linkId, id)
    this.targetScreenId = targetScreenId
    this.entryKey = entryKey
    this.exitKey = exitKey
    if (screenId) this.screenId = screenId
  }

  draw = (ctx: CanvasRenderingContext2D, pt: Point) => {
    ctx.save()
    ctx.translate(pt.x, pt.y)

    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(-GATE_W / 2, -GATE_H / 2, GATE_W, GATE_H, 5)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }
}
