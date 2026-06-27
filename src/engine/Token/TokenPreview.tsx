import type { JSX, ReactNode } from "react"
import { POINT_SPACING } from "../constants"
import type { LinkEndpoint } from "../Link/Link"
import type { LinePreview } from "../Line/LinePreview"
import type { ArrivalPreview } from "../Arrival/ArrivalPreview"
import type { TransformerPreview } from "../Transformer/TransformerPreview"
import type { ScreenGatePreview } from "../ScreenGate/ScreenGatePreview"
import { Token } from "./Token"
import { rng } from "../utils"

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

type ShapeData = {
  id: string
  type: string
  displayColor: string
  color: unknown
  direction: number
  rotationOffset: number
}

const tokenShape = (data: ShapeData, x: number, y: number, angle: number): JSX.Element => {
  const { BASE_R, SQUARE_HALF_BASE, SQUARE_RX, STROKE_WIDTH, PULSE_SPEED, PULSE_AMPLITUDE } = TokenPreview
  const phase = (parseInt(data.id.replace(/\D/g, "") || "0") * 1.7) % (Math.PI * 2)
  const pulse = 1 + Math.sin(Date.now() / PULSE_SPEED + phase) * PULSE_AMPLITUDE
  const color = data.displayColor || (data.color as string)
  const rot = (data.direction === -1 ? angle + Math.PI : angle) + data.rotationOffset

  if (data.type === "cop") {
    const { COP_FLASH_SPEED, COP_COLOR_A, COP_COLOR_B } = TokenPreview
    const flash = Math.sin((Date.now() / 1000) * Math.PI * COP_FLASH_SPEED) > 0
    return <circle cx={x} cy={y} r={BASE_R / 1.6} fill={flash ? COP_COLOR_A : COP_COLOR_B} stroke="#000" strokeWidth={STROKE_WIDTH}/>
  }
  if (data.type === "square") {
    const hw = SQUARE_HALF_BASE * pulse
    return (
      <rect
        x={x - hw} y={y - hw} width={hw * 2} height={hw * 2} rx={SQUARE_RX}
        fill={color} stroke="#000" strokeWidth={STROKE_WIDTH}
        transform={`rotate(${(rot * 180) / Math.PI},${x},${y})`}
      />
    )
  }
  return <circle cx={x} cy={y} r={BASE_R * pulse} fill={color} stroke="#000" strokeWidth={STROKE_WIDTH}/>
}

const tokenTrail = (token: TokenPreview, line: LinePreview): JSX.Element | null => {
  const { TRAIL_SPEED_THRESHOLD, TRAIL_BASE_LEN, TRAIL_SPEED_LEN, TRAIL_SIZE_RATIO, TRAIL_OPACITY, BASE_R } = TokenPreview
  const speedDelta = token.currentSpeed - token.speed
  if (speedDelta <= TRAIL_SPEED_THRESHOLD || token.direction === 0 || line.boost === 0) return null
  const intensity = Math.min(speedDelta / 100, 1)
  const trailLen = Math.round(TRAIL_BASE_LEN + TRAIL_SPEED_LEN * intensity)
  const color = token.displayColor || (token.color as string)
  const pieces: ReactNode[] = []
  for (let i = 1; i <= trailLen; i++) {
    const idx = token.pointIndex - token.direction * i
    if (idx < 0 || idx >= line.points.length) break
    const tpt = line.points[idx]
    const frac = 1 - i / (trailLen + 1)
    pieces.push(<circle key={i} cx={tpt.x} cy={tpt.y} r={BASE_R * frac * TRAIL_SIZE_RATIO} fill={color} opacity={frac * TRAIL_OPACITY}/>)
  }
  return <>{pieces}</>
}

const tokenExplosion = (token: TokenPreview, x: number, y: number): JSX.Element => {
  const { EXPLOSION_PIECE_COUNT, EXPLOSION_SPEED_MIN, EXPLOSION_SPEED_RANGE, EXPLOSION_SIZE_MIN, EXPLOSION_SIZE_RANGE } = TokenPreview
  const progress = token.explosionProgress
  const fade = 1 - token.explosionFadeProgress
  const color = token.displayColor || (token.color as string)
  const seed = token.explosionSeed
  const isSquare = token.type === "square"
  const pieces: ReactNode[] = []
  for (let k = 0; k < EXPLOSION_PIECE_COUNT; k++) {
    const angle = rng(seed, k) * Math.PI * 2
    const speed = EXPLOSION_SPEED_MIN + rng(seed, k + 10) * EXPLOSION_SPEED_RANGE
    const size = EXPLOSION_SIZE_MIN + rng(seed, k + 20) * EXPLOSION_SIZE_RANGE
    const target = 0.2 + rng(seed, k + 25) * 0.8
    const alpha = (1 - progress * (1 - target)) * fade
    const f = 1 - Math.pow(1 - progress, 4)
    const px = x + Math.cos(angle) * f * speed
    const py = y + Math.sin(angle) * f * speed
    if (isSquare) {
      pieces.push(<rect key={`s${k}`} x={px - size} y={py - size} width={size * 2} height={size * 2} fill={color} opacity={alpha}/>)
    } else {
      pieces.push(<circle key={`c${k}`} cx={px} cy={py} r={size} fill={color} opacity={alpha}/>)
    }
  }
  return <>{pieces}</>
}

export class TokenPreview extends Token {
  // pulse animation
  static readonly PULSE_SPEED = 700
  static readonly PULSE_AMPLITUDE = 0.13
  // cop token
  static readonly COP_FLASH_SPEED = 4
  static readonly COP_COLOR_A = "#e53935"
  static readonly COP_COLOR_B = "#1a73e8"
  // base shape
  static readonly BASE_R = 8
  static readonly SQUARE_HALF_BASE = 8
  static readonly SQUARE_RX = 3
  static readonly STROKE_WIDTH = 2
  // trail
  static readonly TRAIL_SPEED_THRESHOLD = 0.5
  static readonly TRAIL_BASE_LEN = 10
  static readonly TRAIL_SPEED_LEN = 30
  static readonly TRAIL_SIZE_RATIO = 0.75
  static readonly TRAIL_OPACITY = 0.55
  // explosion
  static readonly EXPLOSION_PIECE_COUNT = 8
  static readonly EXPLOSION_SPEED_MIN = 30
  static readonly EXPLOSION_SPEED_RANGE = 70
  static readonly EXPLOSION_SIZE_MIN = 2
  static readonly EXPLOSION_SIZE_RANGE = 4

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

  renderShape = (x: number, y: number, angle: number): JSX.Element => tokenShape(this, x, y, angle)

  render = (pt: { x: number; y: number; angle: number }, line: LinePreview): JSX.Element => {
    if (this.exploding) {
      return <g key={this.id}>{tokenExplosion(this, pt.x, pt.y)}</g>
    }
    const isShapeTransforming = this.isTransforming && this.transformProgress > 0 && this.transformMode === "shape"
    return (
      <g key={this.id} opacity={this.opacity}>
        {tokenTrail(this, line)}
        {isShapeTransforming ? (
          <>
            <g opacity={1 - this.transformProgress}>
              {tokenShape(this, pt.x, pt.y, pt.angle)}
            </g>
            <g opacity={this.transformProgress}>
              {tokenShape({ ...this, type: this.pendingType }, pt.x, pt.y, pt.angle)}
            </g>
          </>
        ) : (
          tokenShape(this, pt.x, pt.y, pt.angle)
        )}
      </g>
    )
  }
}
