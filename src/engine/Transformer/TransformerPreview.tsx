import type { JSX, ReactNode } from "react"
import { Transformer } from "./Transformer"

export class TransformerPreview extends Transformer {
  // rotate type
  static readonly ROTATE_ARC_R = 10
  static readonly ROTATE_ARC_SPAN = Math.PI * 0.5
  static readonly ROTATE_SPEED = Math.PI * 1.4
  static readonly ROTATE_ARC_COUNT = 3
  static readonly ROTATE_ARROW_LEN = 4.5
  static readonly ROTATE_ARROW_SPREAD = 0.5
  static readonly ROTATE_STROKE_WIDTH = 2.5
  // fade type
  static readonly FADE_R = 14
  static readonly FADE_MIN_OPACITY = 0.05
  static readonly FADE_STROKE_WIDTH = 2
  // orbit (color/shape type)
  static readonly ORBIT_R = 18
  static readonly ORBIT_STROKE_WIDTH = 2.5
  static readonly ORBIT_DASH = "5 5"
  static readonly ORBIT_DOT_R = 3
  static readonly CENTER_COLOR_R = 4
  static readonly CENTER_SHAPE_R = 5
  static readonly CENTER_SQUARE_HALF = 5
  static readonly CENTER_SQUARE_RX = 2
  static readonly CENTER_STROKE_WIDTH = 2
  // spiral
  static readonly SPIRAL_TURNS = 6
  static readonly SPIRAL_STEPS_PER_TURN = 32
  static readonly SPIRAL_STROKE_WIDTH = 4
  // idle dot
  static readonly IDLE_DOT_SPEED = 0.4
  static readonly DOT_INITIAL_ANGLE = Math.PI / 4

  transformProgress: number = -1
  currentTokenColor: string = ""

  render = (pt: { x: number; y: number }, elapsed: number): JSX.Element => {
    const { type, transformProgress, color, targetType, currentTokenColor, amount } = this
    const {
      ROTATE_ARC_R, ROTATE_ARC_SPAN, ROTATE_SPEED, ROTATE_ARC_COUNT, ROTATE_ARROW_LEN, ROTATE_ARROW_SPREAD, ROTATE_STROKE_WIDTH,
      FADE_R, FADE_MIN_OPACITY, FADE_STROKE_WIDTH,
      ORBIT_R, ORBIT_STROKE_WIDTH, ORBIT_DASH, ORBIT_DOT_R,
      CENTER_COLOR_R, CENTER_SHAPE_R, CENTER_SQUARE_HALF, CENTER_SQUARE_RX, CENTER_STROKE_WIDTH,
      SPIRAL_TURNS, SPIRAL_STEPS_PER_TURN, SPIRAL_STROKE_WIDTH,
      IDLE_DOT_SPEED, DOT_INITIAL_ANGLE,
    } = TransformerPreview

    if (type === "rotate") {
      const rot = elapsed * ROTATE_SPEED
      const r = ROTATE_ARC_R
      const arcSpan = ROTATE_ARC_SPAN
      const arcs: ReactNode[] = []
      for (let i = 0; i < ROTATE_ARC_COUNT; i++) {
        const start = (i * Math.PI * 2) / ROTATE_ARC_COUNT + rot
        const end = start + arcSpan
        const ax = r * Math.cos(end) + pt.x
        const ay = r * Math.sin(end) + pt.y
        const backDir = end - Math.PI / 2
        const alen = ROTATE_ARROW_LEN
        const spread = ROTATE_ARROW_SPREAD
        arcs.push(
          <g key={i}>
            <path
              d={`M${pt.x + r * Math.cos(start)},${pt.y + r * Math.sin(start)}A${r},${r},0,0,1,${pt.x + r * Math.cos(end)},${pt.y + r * Math.sin(end)}`}
              fill="none" stroke="#111" strokeWidth={ROTATE_STROKE_WIDTH} strokeLinecap="round"
            />
            <path
              d={`M${ax + alen * Math.cos(backDir + spread)},${ay + alen * Math.sin(backDir + spread)}L${ax},${ay}L${ax + alen * Math.cos(backDir - spread)},${ay + alen * Math.sin(backDir - spread)}`}
              fill="none" stroke="#111" strokeWidth={ROTATE_STROKE_WIDTH} strokeLinecap="round"
            />
          </g>
        )
      }
      return <g key={this.id}>{arcs}</g>
    }

    if (type === "fade") {
      return (
        <g key={this.id}>
          <circle cx={pt.x} cy={pt.y} r={FADE_R} fill="#000" opacity={Math.max(FADE_MIN_OPACITY, 1 - amount)}/>
          <circle cx={pt.x} cy={pt.y} r={FADE_R} fill="none" stroke="#000" strokeWidth={FADE_STROKE_WIDTH}/>
        </g>
      )
    }

    const dotAngle = transformProgress >= 0
      ? DOT_INITIAL_ANGLE + transformProgress * Math.PI * 2 * SPIRAL_TURNS
      : DOT_INITIAL_ANGLE + elapsed * IDLE_DOT_SPEED
    const totalSegments = transformProgress > 0 ? Math.floor(transformProgress * SPIRAL_TURNS * SPIRAL_STEPS_PER_TURN) : 0
    const spiralSegs: ReactNode[] = []
    if (type === "color" && transformProgress > 0) {
      const steps = SPIRAL_STEPS_PER_TURN * SPIRAL_TURNS
      for (let i = 0; i < Math.min(totalSegments, steps); i++) {
        const a0 = DOT_INITIAL_ANGLE + (i / steps) * Math.PI * 2 * SPIRAL_TURNS
        const a1 = DOT_INITIAL_ANGLE + ((i + 1) / steps) * Math.PI * 2 * SPIRAL_TURNS
        spiralSegs.push(
          <path key={i}
            d={`M${pt.x + ORBIT_R * Math.cos(a0)},${pt.y + ORBIT_R * Math.sin(a0)}A${ORBIT_R},${ORBIT_R},0,0,1,${pt.x + ORBIT_R * Math.cos(a1)},${pt.y + ORBIT_R * Math.sin(a1)}`}
            fill="none" stroke={currentTokenColor || color} strokeWidth={SPIRAL_STROKE_WIDTH} strokeLinecap="butt"
            opacity={(i / steps) / transformProgress}
          />
        )
      }
    }

    return (
      <g key={this.id}>
        <circle cx={pt.x} cy={pt.y} r={ORBIT_R} fill="none" stroke="#bbb" strokeWidth={ORBIT_STROKE_WIDTH} strokeDasharray={ORBIT_DASH}/>
        {spiralSegs}
        <circle cx={pt.x + Math.cos(dotAngle) * ORBIT_R} cy={pt.y + Math.sin(dotAngle) * ORBIT_R} r={ORBIT_DOT_R} fill="#111"/>
        {type === "color" ? (
          <circle cx={pt.x} cy={pt.y} r={CENTER_COLOR_R} fill={color} stroke="#111" strokeWidth={CENTER_STROKE_WIDTH}/>
        ) : (
          targetType === "square"
            ? <rect x={pt.x - CENTER_SQUARE_HALF} y={pt.y - CENTER_SQUARE_HALF} width={CENTER_SQUARE_HALF * 2} height={CENTER_SQUARE_HALF * 2} rx={CENTER_SQUARE_RX} fill="#fff" stroke="#111" strokeWidth={CENTER_STROKE_WIDTH}/>
            : <circle cx={pt.x} cy={pt.y} r={CENTER_SHAPE_R} fill="#fff" stroke="#111" strokeWidth={CENTER_STROKE_WIDTH}/>
        )}
      </g>
    )
  }
}
