import type { Renderer } from "../../render/Renderer"
import type { Link, LinkEndpoint } from "../Link/Link"
import type { Point } from "../../types"
import { runAnimations, type Animation } from "../Animation"
import { COLORS, STROKE_WIDTHS, RADII } from "../../theme"
import { animateAngle } from "../../Utils/numeric"
import { distanceSq } from "../../Utils/geometry"
import { Switch } from "./Switch"
import { getSwitchEnterPoint, curveIntersectAngle } from "./switchUtils"

const SWITCH_R = RADII.node

type LinesRef = Record<string, { points: Point[] }>
type LinksRef = Record<string, Link>
type LinkMapRef = Record<string, LinkEndpoint>

export class SwitchPreview extends Switch {
  activeIndex: number = 0
  pulseTimer: number = 0
  displayAngle: number | undefined = undefined
  targetAngle: number | undefined = undefined
  private _pt: Point | null = null
  private _enterAngle: number | undefined = undefined
  private _allDestAngles: number[] = []

  getActiveLinkId = () => this.linkIds[this.activeIndex] ?? null

  cycle = () => {
    if (this.linkIds.length <= 1) return
    this.activeIndex = (this.activeIndex + 1) % this.linkIds.length
    this.activeLinkId = this.linkIds[this.activeIndex]
    this.pulseTimer = 0.3
  }

  setTargetAngle = (angle: number | undefined) => {
    if (angle === undefined) {
      this.targetAngle = undefined
      this.displayAngle = undefined
      return
    }
    if (this.displayAngle === undefined) this.displayAngle = angle
    this.targetAngle = angle
  }

  tick = (deltaSeconds: number) => {
    if (this.pulseTimer > 0) this.pulseTimer = Math.max(0, this.pulseTimer - deltaSeconds)
    if (this.displayAngle !== undefined && this.targetAngle !== undefined) {
      this.displayAngle = animateAngle(this.displayAngle, this.targetAngle, 8, deltaSeconds)
    }
  }

  prepareFrame = (lines: LinesRef, links: LinksRef, linkMap: LinkMapRef) => {
    const ep = getSwitchEnterPoint(this.linkIds, links)
    if (!ep) { this._pt = null; return }
    const line = lines[ep.lineId]
    if (!line) { this._pt = null; return }
    const pt = ep.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0]
    if (!pt) { this._pt = null; return }
    this._pt = pt

    this._enterAngle = curveIntersectAngle(line.points, ep.endpoint, pt.x, pt.y, SWITCH_R)
      ?? (ep.endpoint === "end" ? (pt.angle ?? 0) + Math.PI : (pt.angle ?? 0))

    const activeDest = linkMap[`${ep.lineId}::${ep.endpoint}`]
    if (activeDest) {
      const destLine = lines[activeDest.lineId]
      if (destLine && destLine.points.length > 0) {
        const activeAngle = curveIntersectAngle(destLine.points, activeDest.endpoint, pt.x, pt.y, SWITCH_R)
          ?? (activeDest.endpoint === "end"
            ? (destLine.points[destLine.points.length - 1].angle ?? 0) + Math.PI
            : (destLine.points[0].angle ?? 0))
        this.setTargetAngle(activeAngle)
      }
    }

    this._allDestAngles = []
    for (const lid of this.linkIds) {
      const link = links[lid]
      if (!link) continue
      const dest = link.line1.lineId === ep.lineId && link.line1.endpoint === ep.endpoint
        ? link.line2
        : link.line1
      const destLine = lines[dest.lineId]
      if (!destLine || destLine.points.length === 0) continue
      const angle = curveIntersectAngle(destLine.points, dest.endpoint, pt.x, pt.y, SWITCH_R)
        ?? (dest.endpoint === "end"
          ? (destLine.points[destLine.points.length - 1].angle ?? 0) + Math.PI
          : (destLine.points[0].angle ?? 0))
      this._allDestAngles.push(angle)
    }
  }

  applyToLinkMap = (links: LinksRef, linkMap: LinkMapRef) => {
    const ep = getSwitchEnterPoint(this.linkIds, links)
    if (!ep) return
    const activeLinkId = this.getActiveLinkId()
    if (!activeLinkId) return
    const link = links[activeLinkId]
    if (!link) return
    const key = `${ep.lineId}::${ep.endpoint}`
    linkMap[key] = link.line1.lineId === ep.lineId && link.line1.endpoint === ep.endpoint
      ? link.line2
      : link.line1
  }

  getPoint = (): Point | null => this._pt

  hitTest = (x: number, y: number): boolean => {
    if (!this._pt) return false
    return distanceSq({ x, y }, this._pt) <= SWITCH_R * SWITCH_R
  }

  private drawStatic = (ctx: Renderer) => {
    const pt = this._pt
    if (!pt) return
    ctx.save()
    ctx.fillStyle = COLORS.white
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, SWITCH_R, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  private animPulseRing = (ctx: Renderer) => {
    const pt = this._pt
    if (!pt || this.pulseTimer <= 0) return
    const t = 1 - this.pulseTimer / 0.3
    ctx.save()
    ctx.setLineDash([])
    ctx.globalAlpha = 1 - t
    ctx.strokeStyle = this.color
    ctx.lineWidth = STROKE_WIDTHS.base
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, SWITCH_R + t * 12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.restore()
  }

  private animArrows = (ctx: Renderer) => {
    const pt = this._pt
    if (!pt) return
    const r = SWITCH_R
    ctx.save()
    ctx.setLineDash([])
    ctx.lineCap = "round"

    if (this._enterAngle !== undefined) {
      ctx.strokeStyle = this.color
      ctx.lineWidth = STROKE_WIDTHS.heavy
      ctx.beginPath()
      ctx.moveTo(pt.x, pt.y)
      ctx.lineTo(pt.x + Math.cos(this._enterAngle) * r, pt.y + Math.sin(this._enterAngle) * r)
      ctx.stroke()
      const ex = pt.x + Math.cos(this._enterAngle) * r
      const ey = pt.y + Math.sin(this._enterAngle) * r
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(ex, ey, 6.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = COLORS.white
      ctx.beginPath()
      ctx.arc(ex, ey, 3.5, 0, Math.PI * 2)
      ctx.fill()
    }

    for (const angle of this._allDestAngles) {
      const isActive = this.displayAngle !== undefined && Math.abs(angle - this.displayAngle) < 0.05
      if (isActive) continue
      const tx = pt.x + Math.cos(angle) * r
      const ty = pt.y + Math.sin(angle) * r
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(tx, ty, 4.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = COLORS.white
      ctx.beginPath()
      ctx.arc(tx, ty, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }

    if (this.displayAngle !== undefined) {
      ctx.strokeStyle = this.color
      ctx.lineWidth = STROKE_WIDTHS.heavy
      ctx.beginPath()
      ctx.moveTo(pt.x, pt.y)
      ctx.lineTo(pt.x + Math.cos(this.displayAngle) * r, pt.y + Math.sin(this.displayAngle) * r)
      ctx.stroke()
      const dx = pt.x + Math.cos(this.displayAngle) * r
      const dy = pt.y + Math.sin(this.displayAngle) * r
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(dx, dy, 6.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = COLORS.white
      ctx.beginPath()
      ctx.arc(dx, dy, 3.5, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  readonly animations: Animation[] = [
    { draw: (ctx, _t) => this.animPulseRing(ctx) },
    { draw: (ctx, _t) => this.animArrows(ctx) },
  ]

  drawBefore = (ctx: Renderer) => {
    if (!this._pt) return
    this.drawStatic(ctx)
  }

  drawAfter = (ctx: Renderer) => {
    if (!this._pt) return
    runAnimations(this.animations, ctx)
  }
}
