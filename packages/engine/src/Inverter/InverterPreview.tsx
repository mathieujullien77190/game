import type { JSX } from "react"
import { Inverter } from "./Inverter"
import type { Link } from "../Link/Link"
import type { LinePreview } from "../Line/LinePreview"

const DOT_R = 5
const DOT_GAP = 14
const COLOR_ON = "#4caf50"
const COLOR_OFF = "#e53935"

export class InverterPreview extends Inverter {
  active: boolean = false

  render = (links: Record<string, Link>, lines: Record<string, LinePreview>, sid: string): JSX.Element | null => {
    const link = links[this.linkId]
    if (!link) return null
    const line = lines[link.line1.lineId]
    if (!line || line.screenId !== sid || line.points.length === 0) return null
    const isEnd = link.line1.endpoint === "end"
    const pt = isEnd ? line.end : line.start
    const ptAngle = isEnd ? line.points[line.points.length - 1] : line.points[0]
    const angle = ptAngle?.angle ?? 0
    const perp = angle + Math.PI / 2
    const ox = Math.cos(perp) * DOT_GAP
    const oy = Math.sin(perp) * DOT_GAP
    return (
      <g key={this.id}>
        <circle cx={pt.x - ox} cy={pt.y - oy} r={DOT_R} fill={COLOR_OFF} opacity={this.active ? 0.1 : 1} />
        <circle cx={pt.x + ox} cy={pt.y + oy} r={DOT_R} fill={COLOR_ON} opacity={this.active ? 1 : 0.1} />
      </g>
    )
  }
}
