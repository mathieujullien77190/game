import type { JSX } from "react"
import { Start } from "./Start"
import type { LineEditor } from "../Line/LineEditor"

export class StartEditor extends Start {
  static readonly RADIUS = 14
  static readonly ARROW_BACK_X = 4
  static readonly ARROW_FRONT_X = 8
  static readonly ARROW_HALF_H = 6

  render = (lines: Record<string, LineEditor>): JSX.Element | null => {
    const line = lines[this.lineId]
    if (!line) return null
    const pt = this.endpoint === "end" ? line.end : line.start
    const { RADIUS: r, ARROW_BACK_X: bx, ARROW_FRONT_X: fx, ARROW_HALF_H: hy } = StartEditor
    return (
      <g key={this.id}>
        <circle cx={pt.x} cy={pt.y} r={r} fill="#000"/>
        <polygon
          points={`${pt.x - bx},${pt.y - hy} ${pt.x + fx},${pt.y} ${pt.x - bx},${pt.y + hy}`}
          fill="#fff"
        />
      </g>
    )
  }
}
