import type { JSX } from "react"
import { Inverter } from "./Inverter"
import { COLOR_BLACK } from "../constants"
import type { Link } from "../Link/Link"
import type { LinePreview } from "../Line/LinePreview"

export class InverterPreview extends Inverter {
  static readonly HALF_LEN = 14
  static readonly STROKE_WIDTH = 3

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
    const { HALF_LEN, STROKE_WIDTH } = InverterPreview
    const dx = Math.cos(perp) * HALF_LEN
    const dy = Math.sin(perp) * HALF_LEN
    return (
      <line key={this.id}
        x1={pt.x - dx} y1={pt.y - dy} x2={pt.x + dx} y2={pt.y + dy}
        stroke={COLOR_BLACK} strokeWidth={STROKE_WIDTH} strokeLinecap="round"
      />
    )
  }
}
