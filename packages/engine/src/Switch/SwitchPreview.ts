import type { Link, LinkEndpoint } from "../Link/Link"
import type { LinePoint } from "../types"
import { Switch } from "./Switch"
import { getSwitchEnterPoint, curveIntersectAngle } from "./switchUtils"

const SWITCH_R = 18

const animateAngle = (current: number, target: number, speed: number, dt: number): number => {
  let delta = target - current
  while (delta > Math.PI) delta -= 2 * Math.PI
  while (delta < -Math.PI) delta += 2 * Math.PI
  if (Math.abs(delta) < 0.005) return target
  return current + delta * speed * dt
}

type LinesRef = Record<string, { points: LinePoint[] }>
type LinksRef = Record<string, Link>
type LinkMapRef = Record<string, LinkEndpoint>

export class SwitchPreview extends Switch {
  activeIndex: number = 0
  pulseTimer: number = 0
  displayAngle: number | undefined = undefined
  targetAngle: number | undefined = undefined
  private _pt: LinePoint | null = null
  private _enterAngle: number | undefined = undefined

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
      ?? (ep.endpoint === "end" ? pt.angle + Math.PI : pt.angle)

    const activeDest = linkMap[`${ep.lineId}::${ep.endpoint}`]
    if (activeDest) {
      const destLine = lines[activeDest.lineId]
      if (destLine && destLine.points.length > 0) {
        const activeAngle = curveIntersectAngle(destLine.points, activeDest.endpoint, pt.x, pt.y, SWITCH_R)
          ?? (activeDest.endpoint === "end"
            ? destLine.points[destLine.points.length - 1].angle + Math.PI
            : destLine.points[0].angle)
        this.setTargetAngle(activeAngle)
      }
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

  getPoint = (): LinePoint | null => this._pt

  hitTest = (x: number, y: number): boolean => {
    if (!this._pt) return false
    const dx = x - this._pt.x
    const dy = y - this._pt.y
    return dx * dx + dy * dy <= SWITCH_R * SWITCH_R
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const pt = this._pt
    if (!pt) return
    const r = SWITCH_R

    ctx.save()
    ctx.setLineDash([])

    if (this.pulseTimer > 0) {
      const t = 1 - this.pulseTimer / 0.3
      ctx.globalAlpha = 1 - t
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, r + t * 12, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"

    if (this._enterAngle !== undefined) {
      ctx.beginPath()
      ctx.moveTo(pt.x, pt.y)
      ctx.lineTo(pt.x + Math.cos(this._enterAngle) * r, pt.y + Math.sin(this._enterAngle) * r)
      ctx.stroke()
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.arc(pt.x + Math.cos(this._enterAngle) * r, pt.y + Math.sin(this._enterAngle) * r, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    if (this.displayAngle !== undefined) {
      ctx.beginPath()
      ctx.moveTo(pt.x, pt.y)
      ctx.lineTo(pt.x + Math.cos(this.displayAngle) * r, pt.y + Math.sin(this.displayAngle) * r)
      ctx.stroke()
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.arc(pt.x + Math.cos(this.displayAngle) * r, pt.y + Math.sin(this.displayAngle) * r, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}
