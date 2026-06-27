import type { JSX } from "react"
import { ScreenGate } from "./ScreenGate"
import type { Link } from "../Link/Link"
import type { LineEditor } from "../Line/LineEditor"

export const GATE_W = 36
export const GATE_H = 64

export class ScreenGateEditor extends ScreenGate {
  static readonly CORNER_RX = 5
  static readonly STROKE_WIDTH = 2
  static readonly ENTRY_MARKER_R = 4
  static readonly EXIT_OUTER_R = 8
  static readonly EXIT_INNER_R = 4
  static readonly OPACITY_DEFAULT = 0.4

  render = (links: Record<string, Link>, lines: Record<string, LineEditor>, hovered: boolean): JSX.Element | null => {
    const link = links[this.linkId]
    if (!link) return null
    const line = lines[link.line1.lineId]
    if (!line) return null
    const pt = link.line1.endpoint === "end" ? line.end : line.start
    const { CORNER_RX, STROKE_WIDTH, OPACITY_DEFAULT } = ScreenGateEditor
    return (
      <rect key={this.id}
        x={pt.x - GATE_W / 2} y={pt.y - GATE_H / 2} width={GATE_W} height={GATE_H} rx={CORNER_RX}
        fill="#fff" stroke="#000" strokeWidth={STROKE_WIDTH}
        opacity={hovered ? 1 : OPACITY_DEFAULT}
      />
    )
  }

  renderMarker = (lines: Record<string, LineEditor>): JSX.Element | null => {
    const { ENTRY_MARKER_R, EXIT_OUTER_R, EXIT_INNER_R } = ScreenGateEditor
    const nodes: JSX.Element[] = []
    if (this.entryKey) {
      const [eLineId, eEp] = this.entryKey.split("::")
      const eLine = lines[eLineId]
      if (eLine) {
        const pt = eEp === "end" ? eLine.end : eLine.start
        nodes.push(<circle key={`entry-${this.id}`} cx={pt.x} cy={pt.y} r={ENTRY_MARKER_R} fill="#000"/>)
      }
    }
    if (this.exitKey) {
      const [xLineId, xEp] = this.exitKey.split("::")
      const xLine = lines[xLineId]
      if (xLine) {
        const pt = xEp === "end" ? xLine.end : xLine.start
        nodes.push(
          <g key={`exit-${this.id}`}>
            <circle cx={pt.x} cy={pt.y} r={EXIT_OUTER_R} fill="none" stroke="#000" strokeWidth={2}/>
            <circle cx={pt.x} cy={pt.y} r={EXIT_INNER_R} fill="#000"/>
          </g>
        )
      }
    }
    if (nodes.length === 0) return null
    return <g key={`marker-${this.id}`}>{nodes}</g>
  }
}
