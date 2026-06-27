import type { JSX } from "react"
import { Start } from "./Start"
import type { LinePreview } from "../Line/LinePreview"
import type { TokenPreview } from "../Token/TokenPreview"

export class StartPreview extends Start {
  static readonly RADIUS = 14
  static readonly STROKE_WIDTH = 3
  static readonly RING_IDLE_COLOR = "#ddd"
  static readonly RING_ACTIVE_COLOR = "#000"

  render = (lines: Record<string, LinePreview>, tokens: TokenPreview[], elapsed: number, sid: string): JSX.Element | null => {
    const line = lines[this.lineId]
    if (!line || line.screenId !== sid) return null
    const pt = this.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0]
    if (!pt) return null

    const { RADIUS: r, STROKE_WIDTH: sw, RING_IDLE_COLOR: idleColor, RING_ACTIVE_COLOR: activeColor } = StartPreview
    const nextWaiting = tokens
      .filter((t) => t.startId === this.id && elapsed < t.startAt)
      .sort((a, b) => a.startAt - b.startAt)[0]
    const remaining = nextWaiting ? nextWaiting.startAt - elapsed : 0
    const progress = this.delay > 0 && remaining > 0 ? 1 - remaining / this.delay : 0
    const angle = this.endpoint === "end" ? pt.angle + Math.PI : pt.angle
    const arcEnd = angle + progress * Math.PI * 2
    const largeArc = progress > 0.5 ? 1 : 0

    return (
      <g key={this.id}>
        {nextWaiting && nextWaiting.renderShape(pt.x, pt.y, pt.angle)}
        {remaining > 0 && this.delay > 0 ? (
          <>
            <circle cx={pt.x} cy={pt.y} r={r} fill="none" stroke={idleColor} strokeWidth={sw}/>
            {progress > 0 && (
              <path
                d={`M${pt.x + r * Math.cos(angle)},${pt.y + r * Math.sin(angle)}A${r},${r},0,${largeArc},1,${pt.x + r * Math.cos(arcEnd)},${pt.y + r * Math.sin(arcEnd)}`}
                fill="none" stroke={activeColor} strokeWidth={sw} strokeLinecap="round"
              />
            )}
          </>
        ) : (
          <circle cx={pt.x} cy={pt.y} r={r} fill="none" stroke={activeColor} strokeWidth={sw}/>
        )}
      </g>
    )
  }
}
