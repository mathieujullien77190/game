import type { JSX } from "react"
import { Inverter } from "./Inverter"
import type { Link } from "../Link/Link"
import type { LineEditor } from "../Line/LineEditor"

export class InverterEditor extends Inverter {
  static readonly HALF_LEN = 14
  static readonly COLOR = "#7b1fa2"
  static readonly STROKE_WIDTH = 3
  static readonly OPACITY_DEFAULT = 0.4

  render = (links: Record<string, Link>, lines: Record<string, LineEditor>, hovered: boolean): JSX.Element | null => {
    const link = links[this.linkId]
    if (!link) return null
    const line = lines[link.line1.lineId]
    if (!line) return null
    const pt = link.line1.endpoint === "end" ? line.end : line.start
    const angle = Math.atan2(line.end.y - line.start.y, line.end.x - line.start.x)
    const perp = angle + Math.PI / 2
    const { HALF_LEN, COLOR, STROKE_WIDTH, OPACITY_DEFAULT } = InverterEditor
    const dx = Math.cos(perp) * HALF_LEN
    const dy = Math.sin(perp) * HALF_LEN
    return (
      <line key={this.id}
        x1={pt.x - dx} y1={pt.y - dy} x2={pt.x + dx} y2={pt.y + dy}
        stroke={COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round"
        opacity={hovered ? 1 : OPACITY_DEFAULT}
      />
    )
  }
}
