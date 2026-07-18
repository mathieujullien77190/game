import type { Renderer } from "../../render/Renderer"
import { POINT_SPACING } from "../../constants"
import type { Point } from "../../types"
import { runAnimations, type Animation } from "../Animation"
import { COLORS } from "../../theme"
import { traceTriangle, traceShapeMorph } from "../../Utils/geometry"
import type { Link, LinkEndpoint } from "../Link/Link"
import type { LinePreview } from "../Line/LinePreview"
import type { ArrivalPreview } from "../Arrival/ArrivalPreview"
import type { TransformerPreview } from "../Transformer/TransformerPreview"
import type { ScreenGatePreview } from "../ScreenGate/ScreenGatePreview"
import type { SwitchPreview } from "../Switch/SwitchPreview"
import type { ClonerPreview } from "../Cloner/ClonerPreview"
import { Token } from "./Token"

// Symétrie rotationnelle par forme : période après laquelle l'orientation se répète visuellement
// (carré : 4 → π/2 ; triangle équilatéral : 3 → 2π/3). 0 = pas d'état "angled" (round, cop).
const ROTATION_PERIOD: Partial<Record<string, number>> = { square: Math.PI / 2, triangle: (Math.PI * 2) / 3 }
const rotationPeriod = (type: string) => ROTATION_PERIOD[type] ?? 0

// Rayon d'affichage par forme (round/square: 9, triangle un peu plus grand pour compenser sa
// surface visuellement plus faible à circumradius égal — cf. drawShape). "cop" et types inconnus
// retombent sur 9 (round), cohérent avec le fallback de shapeRadiusAt.
const SHAPE_RADIUS: Partial<Record<string, number>> = { round: 9, square: 9, triangle: 11 }
const shapeRadius = (type: string) => SHAPE_RADIUS[type] ?? 9

// Incrément du transformer "rotate" : un tour complet + la moitié de la période de la forme
// (flourish visuel de spin qui atterrit pile sur l'état "angled" opposé). Sans période
// particulière (round/cop), on garde l'incrément historique du carré (sans effet visible).
const rotateStep = (type: string) => {
  const p = rotationPeriod(type)
  return p > 0 ? Math.PI * 2 + p / 2 : Math.PI * 2.25
}

export type TransitionCtx = {
  arrivalByKey: Record<string, ArrivalPreview>
  linkByEndpointKey: Record<string, string>
  linkMap: Record<string, LinkEndpoint>
  lines: Record<string, LinePreview>
  links: Record<string, Link>
  switchByEnterKey: Record<string, SwitchPreview>
  clonerByEnterKey: Record<string, ClonerPreview>
  tokens: TokenPreview[]
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
  transformMode: "color" | "shape" | "fade" = "shape"
  opacityFrom: number = 1
  pendingType: string = "round"
  pendingLineId: string = ""
  pendingPointIndex: number = 0
  pendingDirection: 1 | -1 = 1
  pendingRemainder: number = 0
  pendingOpacity: number = 1
  portalContext: { returnLineId: string; returnPointIndex: number; returnDirection: 1 | -1; returnRemainder: number } | null = null
  speedingLineId: string = ""
  exploding: boolean = false
  explosionProgress: number = 0
  explosionFadeProgress: number = 0
  explosionSeed: number = 0
  // Fait glisser `opacity` vers `pendingOpacity` (cf. PreviewManager.tickSim) — utilisé par le
  // Cloner : `true` en continu tant que le fondu (entrée ou sortie) n'est pas arrivé à
  // destination, remis à `false` automatiquement une fois convergé.
  fadingOpacity: boolean = false

  private _pt: Point | null = null
  private _speedDelta: number = 0
  private _points: Point[] = []
  private _opacityOverride: number | undefined = undefined

  private get _eff() {
    return this._opacityOverride !== undefined
      ? Math.min(this.opacity, this._opacityOverride)
      : this.opacity
  }

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

  // Un switch en mode "auto" ignore son activeLinkId : la destination dépend de la couleur du token.
  private resolveNext = (key: string, ctx: TransitionCtx): LinkEndpoint | undefined => {
    const sw = ctx.switchByEnterKey[key]
    if (sw?.mode === "auto") {
      const tokenColor = this.displayColor || (this.color as string)
      return sw.resolveAutoDestination(tokenColor, ctx.links, ctx.lines) ?? ctx.linkMap[key]
    }
    return ctx.linkMap[key]
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

    const arrival = ctx.arrivalByKey[`${this.lineId}::${arrivedAt}`]
    if (arrival) {
      // Les cop sont ignorés par l'arrivée (pas de match/flash) mais retirés du réseau.
      if (this.type !== "cop") {
        const demand = arrival.demands[arrival.currentDemandIndex]
        const tokenColor = this.displayColor || (this.color as string)
        const period = rotationPeriod(this.type as string)
        const norm = period > 0 ? (((this.targetRotationOffset % period) + period) % period) : 0
        const tokenAngled = period > 0 && norm > period / 4
        const matches = !!demand
          && demand.color === tokenColor
          && demand.type === (this.type as string)
          && (period === 0 || demand.angled === tokenAngled)
        if (matches) {
          const n = arrival.demands.length
          arrival.flashColor = COLORS.arrivalMatch
          arrival.flashProgress = 0
          arrival.arcTarget = Math.min(n, arrival.arcTarget + 1)
          arrival.fadingIndex = arrival.currentDemandIndex
          arrival.isFading = true
          arrival.fadeAlpha = 1
          arrival.currentDemandIndex++
        } else {
          arrival.flashColor = COLORS.red
          arrival.flashProgress = 0
        }
      }
      this.arrived = true
      this.direction = 0
      return { isInverted, isGrayscale, isDark }
    }

    const linkId = ctx.linkByEndpointKey[`${this.lineId}::${arrivedAt}`]
    const transformer = linkId ? ctx.transformers[ctx.transformerByLinkId[linkId]] : undefined
    if (transformer?.type === "rotate") this.targetRotationOffset += rotateStep(this.type as string)
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

    if (transformer?.type === "color" || transformer?.type === "shape" || transformer?.type === "fade") {
      const currentColor = this.displayColor || (this.color as string)
      const needsColor = transformer.type === "color" && currentColor !== transformer.color
      const needsShape = transformer.type === "shape" && (this.type as string) !== transformer.targetType
      const needsFade = transformer.type === "fade" && this.opacity !== transformer.amount
      if (needsColor || needsShape || needsFade) {
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
        if (needsFade) {
          this.opacityFrom = this.opacity
        }
        const other = this.resolveNext(`${this.lineId}::${arrivedAt}`, ctx)
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

    const key = `${this.lineId}::${arrivedAt}`
    const cloner = ctx.clonerByEnterKey[key]
    if (cloner) {
      // `cloner.linkIds` ne contient, par construction (cf. getSwitchEnterPoint / placement
      // dans l'éditeur), que des links où la ligne d'arrivée (ep) est un côté — jamais un link
      // "entre deux autres sorties" — donc pas besoin d'exclure un "link d'arrivée" : chaque
      // link de linkIds pointe déjà vers une des AUTRES lignes du carrefour.
      const ep: LinkEndpoint = { lineId: this.lineId, endpoint: arrivedAt }
      let firstDest: LinkEndpoint | undefined
      for (const lid of cloner.linkIds) {
        const link = ctx.links[lid]
        if (!link || !link.activated) continue
        const dest = link.line1.lineId === ep.lineId && link.line1.endpoint === ep.endpoint
          ? link.line2
          : link.line1
        if (!firstDest) firstDest = dest
        const destLine = ctx.lines[dest.lineId]
        const clone = new TokenPreview(this.color, this.speed, undefined, this.type)
        clone.rotationOffset = this.rotationOffset
        clone.targetRotationOffset = this.targetRotationOffset
        clone.lineId = dest.lineId
        clone.pointIndex = dest.endpoint === "start" ? 0 : (destLine?.points.length ?? 1) - 1
        clone.remainder = excess
        clone.direction = dest.endpoint === "start" ? 1 : -1
        // Part tout de suite, mais invisible : PreviewManager.tickSim fait glisser son
        // opacity de 0 vers `pendingOpacity` (cf. Cloner/CLAUDE.md).
        clone.opacity = 0
        clone.pendingOpacity = this.opacity
        clone.fadingOpacity = true
        ctx.tokens.push(clone)
      }
      cloner.trigger()
      // Ne s'arrête pas net sur le carrefour : continue sur la première sortie comme un clone
      // de plus (même ligne/direction), en se fondant vers opacity 0 en route plutôt que de
      // rester figé — `arrived` n'est posé qu'une fois ce fondu terminé (cf. Cloner/CLAUDE.md).
      if (firstDest) {
        const destLine = ctx.lines[firstDest.lineId]
        this.lineId = firstDest.lineId
        this.pointIndex = firstDest.endpoint === "start" ? 0 : (destLine?.points.length ?? 1) - 1
        this.direction = firstDest.endpoint === "start" ? 1 : -1
        this.remainder = excess
      } else {
        this.direction = 0
      }
      this.pendingOpacity = 0
      this.fadingOpacity = true
      return { isInverted, isGrayscale, isDark }
    }

    const other = this.resolveNext(key, ctx)
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

  drawBoostTrail = (ctx: Renderer, speedDelta: number, points: Point[], eff: number) => {
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
      ctx.arc(tpt.x, tpt.y, 9 * frac * 0.75, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  private drawShape = (ctx: Renderer, pt: Point, type: string, eff = 1) => {
    const color = this.displayColor || (this.color as string)
    const moving = this.direction !== 0 && this.currentSpeed > 0

    if (type === "cop") {
      const flash = Math.sin(Date.now() / 1000 * Math.PI * 4) > 0
      const copColor = flash ? COLORS.red : COLORS.blue
      const r = 9 / 1.6
      ctx.fillStyle = copColor
      ctx.globalAlpha = 0.1 * eff
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, r * 1.8, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = eff
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      return
    }

    const phase = (parseInt(this.id.replace(/\D/g, "") || "0") * 1.7) % (Math.PI * 2)
    const pulse = 1 + Math.sin(Date.now() / 700 + phase) * 0.13
    ctx.fillStyle = color

    if (type === "square") {
      const angle = (this.direction === -1 ? (pt.angle ?? 0) + Math.PI : (pt.angle ?? 0)) + this.rotationOffset
      ctx.save()
      ctx.translate(pt.x, pt.y)
      ctx.rotate(angle)
      if (moving) {
        const hwBig = 9 * 1.8
        ctx.globalAlpha = 0.1 * eff
        ctx.beginPath()
        ctx.roundRect(-hwBig, -hwBig, hwBig * 2, hwBig * 2, 3 * 1.8)
        ctx.fill()
      }
      ctx.globalAlpha = eff
      ctx.scale(pulse, pulse)
      ctx.beginPath()
      ctx.roundRect(-9, -9, 18, 18, 3)
      ctx.fill()
      ctx.restore()
    } else if (type === "triangle") {
      const angle = (this.direction === -1 ? (pt.angle ?? 0) + Math.PI : (pt.angle ?? 0)) + this.rotationOffset
      ctx.save()
      ctx.translate(pt.x, pt.y)
      if (moving) {
        ctx.globalAlpha = 0.1 * eff
        traceTriangle(ctx, 0, 0, 11 * 1.8, angle)
        ctx.fill()
      }
      ctx.globalAlpha = eff
      ctx.scale(pulse, pulse)
      traceTriangle(ctx, 0, 0, 11, angle)
      ctx.fill()
      ctx.restore()
    } else {
      if (moving) {
        ctx.globalAlpha = 0.1 * eff
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 9 * 1.8, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = eff
      ctx.save()
      ctx.translate(pt.x, pt.y)
      ctx.scale(pulse, pulse)
      ctx.beginPath()
      ctx.arc(0, 0, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    ctx.globalAlpha = 1
  }

  // Transformer "shape" en cours : contour interpolé entre l'ancienne et la nouvelle forme
  // (traceShapeMorph) plutôt qu'un fade entre deux formes superposées — cf. Token/CLAUDE.md.
  private drawMorphingShape = (ctx: Renderer, pt: Point, eff = 1) => {
    const color = this.displayColor || (this.color as string)
    const moving = this.direction !== 0 && this.currentSpeed > 0
    const phase = (parseInt(this.id.replace(/\D/g, "") || "0") * 1.7) % (Math.PI * 2)
    const pulse = 1 + Math.sin(Date.now() / 700 + phase) * 0.13
    const angle = (this.direction === -1 ? (pt.angle ?? 0) + Math.PI : (pt.angle ?? 0)) + this.rotationOffset

    const rFrom = shapeRadius(this.type as string)
    const rTo = shapeRadius(this.pendingType)

    ctx.fillStyle = color
    ctx.save()
    ctx.translate(pt.x, pt.y)
    if (moving) {
      ctx.globalAlpha = 0.1 * eff
      traceShapeMorph(ctx, 0, 0, this.type as string, this.pendingType, rFrom * 1.8, rTo * 1.8, this.transformProgress, angle)
      ctx.fill()
    }
    ctx.globalAlpha = eff
    ctx.scale(pulse, pulse)
    traceShapeMorph(ctx, 0, 0, this.type as string, this.pendingType, rFrom, rTo, this.transformProgress, angle)
    ctx.fill()
    ctx.restore()
    ctx.globalAlpha = 1
  }

  drawExplosion = (ctx: Renderer, pt: Point) => {
    const progress = this.explosionProgress
    const fade = 1 - this.explosionFadeProgress
    const color = this.displayColor || (this.color as string)
    const x = pt.x, y = pt.y
    const seed = this.explosionSeed
    const rng = (i: number) => { const n = Math.sin(seed + i * 9301 + 49297) * 233280; return n - Math.floor(n) }
    const isSquare = this.type === "square"
    const isTriangle = this.type === "triangle"

    const drawPiece = (px: number, py: number, r: number, alpha: number) => {
      ctx.globalAlpha = Math.max(0, alpha * fade)
      ctx.fillStyle = color
      if (isSquare) {
        ctx.beginPath()
        ctx.roundRect(px - r, py - r, r * 2, r * 2, r * 0.4)
      } else if (isTriangle) {
        traceTriangle(ctx, px, py, r)
      } else {
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
      }
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

    ctx.restore()
  }

  // Angle d'orientation réel du token à un point de ligne (même formule que drawShape) :
  // tangente de la ligne (inversée si direction -1) + rotationOffset courant.
  orientation = (pt: Point): number =>
    (this.direction === -1 ? (pt.angle ?? 0) + Math.PI : (pt.angle ?? 0)) + this.rotationOffset

  drawMini = (ctx: Renderer, x: number, y: number, angle = 0) => {
    ctx.fillStyle = (this.displayColor || this.color) as string
    if (this.type === "square") {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.rect(-3, -3, 6, 6)
      ctx.fill()
      ctx.restore()
    } else if (this.type === "triangle") {
      traceTriangle(ctx, x, y, 5, angle)
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  private drawStatic = (_ctx: Renderer) => {}

  private animBoostTrail = (ctx: Renderer) => {
    if (this._points.length === 0) return
    this.drawBoostTrail(ctx, this._speedDelta, this._points, this._eff)
  }

  private animShape = (ctx: Renderer) => {
    if (!this._pt) return
    const eff = this._eff
    const pt = this._pt
    if (this.isTransforming && this.transformProgress > 0 && this.transformMode === "shape") {
      this.drawMorphingShape(ctx, pt, eff)
      return
    }
    this.drawShape(ctx, pt, this.type as string, eff)
  }

  readonly animations: Animation[] = [
    { draw: (ctx, _t) => this.animBoostTrail(ctx) },
    { draw: (ctx, _t) => this.animShape(ctx) },
  ]

  drawBefore = (ctx: Renderer, pt: Point, speedDelta = 0, points?: Point[], opacityOverride?: number) => {
    this._pt = pt
    this._speedDelta = speedDelta
    this._points = points ?? []
    this._opacityOverride = opacityOverride
    this.drawStatic(ctx)
    runAnimations(this.animations, ctx)
  }
}
