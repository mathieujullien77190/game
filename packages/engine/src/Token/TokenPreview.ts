import { POINT_SPACING } from "../constants"
import type { LinePoint } from "../types"
import type { LinkEndpoint } from "../Link/Link"
import type { LinePreview } from "../Line/LinePreview"
import type { ArrivalPreview } from "../Arrival/ArrivalPreview"
import type { TransformerPreview } from "../Transformer/TransformerPreview"
import type { ScreenGatePreview } from "../ScreenGate/ScreenGatePreview"
import { Token } from "./Token"

export type TransitionCtx = {
  arrivalKey: string
  arrival: ArrivalPreview | null
  linkByEndpointKey: Record<string, string>
  linkMap: Record<string, LinkEndpoint>
  lines: Record<string, LinePreview>
  transformers: Record<string, TransformerPreview>
  transformerByLinkId: Record<string, string>
  inverterLinkMap: Map<string, "invert" | "grayscale" | "dark">
  isInverted: boolean
  isGrayscale: boolean
  isDark: boolean
  screenGateByLinkId: Record<string, ScreenGatePreview>
  screenGateByExitKey: Record<string, ScreenGatePreview>
}

export class TokenPreview extends Token {
  startId: string = ""
  lineId: string = ""
  pointIndex: number = 0
  remainder: number = 0
  direction: 1 | -1 | 0 = 1
  startAt: number = 0
  currentSpeed: number = 0
  rotationOffset: number = 0
  targetRotationOffset: number = 0
  colorTransitionFrom: string = ""
  displayColor: string = ""
  colorProgress: number = 1
  opacity: number = 1
  arrived: boolean = false
  isTransforming: boolean = false
  transformProgress: number = 0
  transformingLinkId: string = ""
  transformMode: "color" | "shape" = "shape"
  pendingType: string = "round"
  pendingLineId: string = ""
  pendingPointIndex: number = 0
  pendingDirection: 1 | -1 = 1
  pendingRemainder: number = 0
  portalContext: { returnLineId: string; returnPointIndex: number; returnDirection: 1 | -1; returnRemainder: number } | null = null
  speedingLineId: string = ""
  exploding: boolean = false
  explosionProgress: number = 0
  explosionFadeProgress: number = 0
  explosionSeed: number = 0

  advance = (deltaSeconds: number, pointCount: number): { hit: "start" | "end"; excess: number } | null => {
    let budget = Math.max(1, this.currentSpeed) * deltaSeconds + this.remainder
    const maxIndex = pointCount - 1
    while (budget >= POINT_SPACING) {
      budget -= POINT_SPACING
      const next = this.pointIndex + this.direction
      if (next > maxIndex) return { hit: "end", excess: budget }
      if (next < 0) return { hit: "start", excess: budget }
      this.pointIndex = next
    }
    this.remainder = budget
    return null
  }

  transition = (arrivedAt: "start" | "end", excess: number, ctx: TransitionCtx): { isInverted: boolean; isGrayscale: boolean; isDark: boolean } => {
    let isInverted = ctx.isInverted
    let isGrayscale = ctx.isGrayscale
    let isDark = ctx.isDark

    if (this.portalContext) {
      const exitGate = ctx.screenGateByExitKey[`${this.lineId}::${arrivedAt}`]
      if (exitGate) {
        this.lineId = this.portalContext.returnLineId
        this.pointIndex = this.portalContext.returnPointIndex
        this.direction = this.portalContext.returnDirection
        this.remainder = this.portalContext.returnRemainder
        this.portalContext = null
        return { isInverted, isGrayscale, isDark }
      }
    }

    if (ctx.arrivalKey && ctx.arrivalKey === `${this.lineId}::${arrivedAt}`) {
      if (ctx.arrival) {
        ctx.arrival.isFading = true
        ctx.arrival.fadeAlpha = 1
      }
      this.arrived = true
      this.direction = 0
      return { isInverted, isGrayscale, isDark }
    }

    const linkId = ctx.linkByEndpointKey[`${this.lineId}::${arrivedAt}`]
    const transformer = linkId ? ctx.transformers[ctx.transformerByLinkId[linkId]] : undefined
    if (transformer?.type === "rotate") this.targetRotationOffset += Math.PI * 2.25
    if (transformer?.type === "fade") this.opacity = transformer.amount
    const inverterEffect = linkId ? ctx.inverterLinkMap.get(linkId) : undefined
    if (inverterEffect === "invert") isInverted = !isInverted
    else if (inverterEffect === "grayscale") isGrayscale = !isGrayscale
    else if (inverterEffect === "dark") isDark = !isDark

    const screenGate = linkId ? ctx.screenGateByLinkId[linkId] : undefined
    if (screenGate) {
      const other = ctx.linkMap[`${this.lineId}::${arrivedAt}`]
      if (other) {
        const returnLine = ctx.lines[other.lineId]
        this.portalContext = {
          returnLineId: other.lineId,
          returnPointIndex: other.endpoint === "start" ? 0 : (returnLine?.points.length ?? 1) - 1,
          returnDirection: other.endpoint === "start" ? 1 : -1,
          returnRemainder: excess,
        }
      }
      const [entryLineId, entryEndpoint] = screenGate.entryKey.split("::")
      const entryLine = ctx.lines[entryLineId]
      if (entryLine) {
        this.lineId = entryLineId
        this.pointIndex = entryEndpoint === "start" ? 0 : entryLine.points.length - 1
        this.direction = entryEndpoint === "start" ? 1 : -1
        this.remainder = excess
      }
      return { isInverted, isGrayscale, isDark }
    }

    if (transformer?.type === "color" || transformer?.type === "shape") {
      const currentColor = this.displayColor || (this.color as string)
      const needsColor = transformer.type === "color" && currentColor !== transformer.color
      const needsShape = transformer.type === "shape" && (this.type as string) !== transformer.targetType
      if (needsColor || needsShape) {
        this.isTransforming = true
        this.transformProgress = 0
        this.transformingLinkId = linkId
        this.transformMode = transformer.type
        this.direction = 0
        this.currentSpeed = this.speed
        transformer.transformProgress = 0
        if (needsColor) {
          this.colorTransitionFrom = currentColor
          this.color = transformer.color as any
          this.colorProgress = 0
        }
        if (needsShape) {
          this.pendingType = transformer.targetType
        }
        const other = ctx.linkMap[`${this.lineId}::${arrivedAt}`]
        if (other) {
          const newLine = ctx.lines[other.lineId]
          this.pendingLineId = other.lineId
          this.pendingPointIndex = other.endpoint === "start" ? 0 : (newLine?.points.length ?? 1) - 1
          this.pendingDirection = other.endpoint === "start" ? 1 : -1
          this.pendingRemainder = excess
        } else {
          const line = ctx.lines[this.lineId]
          this.pointIndex = arrivedAt === "end" ? (line?.points.length ?? 1) - 1 : 0
          this.remainder = 0
          this.pendingLineId = ""
        }
        return { isInverted, isGrayscale, isDark }
      }
    }

    const other = ctx.linkMap[`${this.lineId}::${arrivedAt}`]
    if (other) {
      this.lineId = other.lineId
      const newLine = ctx.lines[this.lineId]
      this.pointIndex = other.endpoint === "start" ? 0 : (newLine?.points.length ?? 1) - 1
      this.direction = other.endpoint === "start" ? 1 : -1
      this.remainder = excess
    } else {
      const line = ctx.lines[this.lineId]
      this.pointIndex = arrivedAt === "end" ? (line?.points.length ?? 1) - 1 : 0
      this.remainder = 0
      this.direction = 0
    }

    return { isInverted, isGrayscale, isDark }
  }

  drawBoostTrail = (ctx: CanvasRenderingContext2D, speedDelta: number, points: LinePoint[], eff: number) => {
    if (speedDelta <= 0.5 || this.direction === 0) return
    const intensity = Math.min(speedDelta / 100, 1)
    const trailLen = Math.round(10 + 30 * intensity)
    for (let i = 1; i <= trailLen; i++) {
      const idx = this.pointIndex - this.direction * i
      if (idx < 0 || idx >= points.length) break
      const tpt = points[idx]
      const frac = 1 - i / (trailLen + 1)
      ctx.globalAlpha = frac * 0.55 * eff
      ctx.fillStyle = this.displayColor || (this.color as string)
      ctx.beginPath()
      ctx.arc(tpt.x, tpt.y, 8 * frac * 0.75, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  private drawShape = (ctx: CanvasRenderingContext2D, pt: LinePoint, type: string) => {
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    if (type === "cop") {
      const flash = Math.sin(Date.now() / 1000 * Math.PI * 4) > 0
      ctx.fillStyle = flash ? "#e53935" : "#1a73e8"
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      return
    }
    const phase = (parseInt(this.id.replace(/\D/g, "") || "0") * 1.7) % (Math.PI * 2)
    const pulse = 1 + Math.sin(Date.now() / 700 + phase) * 0.13
    ctx.fillStyle = this.displayColor || (this.color as string)
    if (type === "square") {
      const angle = (this.direction === -1 ? pt.angle + Math.PI : pt.angle) + this.rotationOffset
      ctx.save()
      ctx.translate(pt.x, pt.y)
      ctx.rotate(angle)
      ctx.scale(pulse, pulse)
      ctx.beginPath()
      ctx.roundRect(-8, -8, 16, 16, 3)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    } else {
      ctx.save()
      ctx.translate(pt.x, pt.y)
      ctx.scale(pulse, pulse)
      ctx.beginPath()
      ctx.arc(0, 0, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }
  }

  drawExplosion = (ctx: CanvasRenderingContext2D, pt: LinePoint) => {
    const progress = this.explosionProgress
    const fade = 1 - this.explosionFadeProgress
    const color = this.displayColor || (this.color as string)
    const x = pt.x, y = pt.y
    const seed = this.explosionSeed
    const rng = (i: number) => { const n = Math.sin(seed + i * 9301 + 49297) * 233280; return n - Math.floor(n) }
    const isSquare = this.type === "square"

    const drawPiece = (px: number, py: number, r: number, alpha: number) => {
      ctx.globalAlpha = Math.max(0, alpha * fade)
      ctx.fillStyle = color
      ctx.beginPath()
      if (isSquare) ctx.rect(px - r, py - r, r * 2, r * 2)
      else ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.save()

    for (let k = 0; k < 8; k++) {
      const angle = rng(k) * Math.PI * 2
      const speed = 30 + rng(k + 10) * 70
      const size = 2 + rng(k + 20) * 4
      const target = 0.2 + rng(k + 25) * 0.8
      const alpha = 1 - progress * (1 - target)
      const f = 1 - Math.pow(1 - progress, 4)
      const px = x + Math.cos(angle) * f * speed
      const py = y + Math.sin(angle) * f * speed
      drawPiece(px, py, size, alpha)
    }

    for (let k = 0; k < 4; k++) {
      const angle = rng(k) * Math.PI * 2
      const speed = 30 + rng(k + 10) * 70
      const target = 0.2 + rng(k + 35) * 0.8
      const alpha = 1 - progress * (1 - target)
      const f = 1 - Math.pow(1 - progress, 4)
      const px = x + Math.cos(angle) * f * speed
      const py = y + Math.sin(angle) * f * speed
      const rotDir = rng(k + 30) > 0.5 ? 1 : -1
      const rot = angle + rotDir * progress * Math.PI * 0.5
      ctx.globalAlpha = alpha * fade
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.save()
      ctx.translate(px, py)
      if (isSquare) {
        ctx.rotate(rot)
        ctx.beginPath()
        ctx.moveTo(-8, 0)
        ctx.lineTo(8, 0)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, 8, rot, rot + Math.PI / 2)
        ctx.stroke()
      }
      ctx.restore()
    }

    ctx.restore()
  }

  draw = (ctx: CanvasRenderingContext2D, pt: LinePoint, speedDelta = 0, points?: LinePoint[], opacityOverride?: number) => {
    const eff = opacityOverride !== undefined ? Math.min(this.opacity, opacityOverride) : this.opacity
    if (points) this.drawBoostTrail(ctx, speedDelta, points, eff)
    if (this.isTransforming && this.transformProgress > 0 && this.transformMode === "shape") {
      ctx.globalAlpha = eff * (1 - this.transformProgress)
      this.drawShape(ctx, pt, this.type as string)
      ctx.globalAlpha = eff * this.transformProgress
      this.drawShape(ctx, pt, this.pendingType)
      ctx.globalAlpha = 1
      return
    }
    ctx.globalAlpha = eff
    this.drawShape(ctx, pt, this.type as string)
    ctx.globalAlpha = 1
  }
}
