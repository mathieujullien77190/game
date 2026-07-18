import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { runAnimations, type Animation } from "../Animation"
import { COLORS, STROKE_WIDTHS } from "../../theme"
import { Line } from "./Line"

export type SpeedBadge = { pt: Point; speed: number; color: string }

export class LinePreview extends Line {
  private _badges: SpeedBadge[] = []

  private tracePath = (ctx: Renderer) => {
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
  }

  private drawStatic = (ctx: Renderer) => {
    if (this.tunnel) {
      ctx.fillStyle = COLORS.black
      ctx.beginPath()
      ctx.arc(this.start.x, this.start.y, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(this.end.x, this.end.y, 7, 0, Math.PI * 2)
      ctx.fill()
      return
    }
    ctx.strokeStyle = this.color ?? COLORS.grayLight
    ctx.lineWidth = STROKE_WIDTHS.lineGlow
    ctx.lineCap = "round"
    ctx.setLineDash([])
    this.tracePath(ctx)
    ctx.stroke()
  }

  drawGlow = (ctx: Renderer, elapsedSeconds = 0) => {
    if (this.boost === 0) return
    const pts = this.points
    if (pts.length < 2) return
    const total = pts.length
    const winSize = Math.max(2, Math.floor(total * 0.25))
    const cycle = total + winSize
    const rawOffset = Math.floor((elapsedSeconds * Math.abs(this.boost) * 4) % cycle) - winSize
    let tail: number, head: number
    if (this.boost > 0) {
      tail = Math.max(rawOffset, 0)
      head = Math.min(rawOffset + winSize, total - 1)
    } else {
      const rev = total - rawOffset - winSize
      tail = Math.max(rev, 0)
      head = Math.min(rev + winSize, total - 1)
    }
    if (tail >= head) return
    ctx.save()
    ctx.strokeStyle = COLORS.glow
    ctx.lineWidth = STROKE_WIDTHS.base
    ctx.lineCap = "round"
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(pts[tail].x, pts[tail].y)
    for (let i = tail + 1; i <= head; i++) ctx.lineTo(pts[i].x, pts[i].y)
    ctx.stroke()
    ctx.restore()
  }

  // Un badge vitesse par token, collé au token et le suit ; animé (sa position = celle du token,
  // recalculée chaque frame). `_badges` est réalimenté par le manager via `drawAfter`.
  private animSpeedBadges = (ctx: Renderer) => {
    if (!this.showSpeed || this._badges.length === 0) return
    const rw = 26, rh = 19, gap = 10, tokenR = 9
    ctx.save()
    ctx.font = "bold 9px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    for (const b of this._badges) {
      if (!b.pt) continue
      let cx = b.pt.x, cy = b.pt.y
      if (this.speedPos === "left") cx -= tokenR + gap + rw / 2
      else if (this.speedPos === "right") cx += tokenR + gap + rw / 2
      else if (this.speedPos === "bottom") cy += tokenR + gap + rh / 2
      else cy -= tokenR + gap + rh / 2
      const rx = cx - rw / 2, ry = cy - rh / 2
      ctx.fillStyle = b.color || COLORS.white
      ctx.beginPath()
      ctx.roundRect(rx, ry, rw, rh, 4)
      ctx.fill()
      ctx.fillStyle = COLORS.black
      ctx.fillText(Math.round(b.speed).toString(), cx, cy)
    }
    ctx.restore()
  }

  // Cercle de limitation — statique (indépendant du temps), dessiné au-dessus des tokens.
  private drawLimitation = (ctx: Renderer) => {
    if (this.limitation === 0) return
    const mid = this.points[Math.floor(this.points.length / 2)]
    if (!mid) return
    const r = 11
    ctx.save()
    ctx.font = "bold 9px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = COLORS.white
    ctx.strokeStyle = COLORS.limitationRedPastel
    ctx.lineWidth = STROKE_WIDTHS.lineGlow - 2
    ctx.beginPath()
    ctx.arc(mid.x, mid.y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = COLORS.black
    ctx.fillText(this.limitation.toString(), mid.x, mid.y + 1)
    ctx.restore()
  }

  // Couche animée SOUS les tokens (le glow suit le rail, doit rester derrière la balle).
  readonly animations: Animation[] = [
    { draw: (ctx, t) => this.drawGlow(ctx, t.elapsed) },
  ]

  // Couche animée AU-DESSUS des tokens (les badges collent aux tokens, doivent rester devant).
  readonly overlayAnimations: Animation[] = [
    { draw: (ctx, _t) => this.animSpeedBadges(ctx) },
  ]

  drawBefore = (ctx: Renderer, elapsedSeconds = 0) => {
    this.drawStatic(ctx)
    runAnimations(this.animations, ctx, elapsedSeconds)
  }

  drawAfter = (ctx: Renderer, badges: SpeedBadge[] = []) => {
    this._badges = badges
    this.drawLimitation(ctx)
    runAnimations(this.overlayAnimations, ctx)
  }
}
