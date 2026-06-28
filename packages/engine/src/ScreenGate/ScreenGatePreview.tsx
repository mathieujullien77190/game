import type { JSX } from "react"
import { ScreenGate } from "./ScreenGate"
import { GATE_W, GATE_H } from "./ScreenGateEditor"
import { CANVAS_W, COLOR_WHITE, COLOR_GRAY, COLOR_GRAY_ACCENT, GAME_FONT } from "../constants"
import { miniToken } from "../miniToken"
import type { Link } from "../Link/Link"
import type { TokenPreview } from "../Token/TokenPreview"
import type { LinePreview } from "../Line/LinePreview"

export class ScreenGatePreview extends ScreenGate {
  static readonly CORNER_RX = 5
  static readonly STROKE_WIDTH = 4
  static readonly LABEL_FONT_SIZE = 14
  static readonly ENTRY_MARKER_R = 4
  static readonly EXIT_OUTER_R = 10
  static readonly EXIT_INNER_R = 4
  static readonly MINI_TOKEN_R = 2
  static readonly MINI_STROKE_WIDTH = 0.5

  timeMultiplier: number = 1

  constructor(linkId: string, targetScreenId: string, entryKey: string, exitKey: string, id?: string, screenId?: string) {
    super(linkId, id)
    this.targetScreenId = targetScreenId
    this.entryKey = entryKey
    this.exitKey = exitKey
    if (screenId) this.screenId = screenId
  }

  render = (
    links: Record<string, Link>,
    lines: Record<string, LinePreview>,
    tokens: TokenPreview[],
    elapsed: number,
    sid: string,
  ): JSX.Element | null => {
    if (this.screenId !== sid) return null
    const link = links[this.linkId]
    if (!link) return null
    const line = lines[link.line1.lineId]
    if (!line) return null
    const pt = link.line1.endpoint === "end" ? line.end : line.start

    const { CORNER_RX, STROKE_WIDTH, LABEL_FONT_SIZE, MINI_TOKEN_R, MINI_STROKE_WIDTH } = ScreenGatePreview
    const S = GATE_W / CANVAS_W
    const tokensInside = tokens.filter((t) => {
      const tLine = lines[t.lineId]
      return elapsed >= t.startAt && tLine?.screenId === this.targetScreenId
    })

    return (
      <g key={this.id}>
        <rect x={pt.x - GATE_W / 2} y={pt.y - GATE_H / 2} width={GATE_W} height={GATE_H} rx={CORNER_RX}
          fill={COLOR_WHITE} stroke={COLOR_GRAY} strokeWidth={STROKE_WIDTH}/>
        {this.timeMultiplier !== 1 && (
          <text x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle"
            fontFamily={GAME_FONT} fontSize={LABEL_FONT_SIZE} fontWeight="bold" fill={COLOR_GRAY}>
            {this.timeMultiplier > 1
              ? `+${Math.round(this.timeMultiplier)}`
              : `-${Math.round(1 / this.timeMultiplier)}`}
          </text>
        )}
        <clipPath id={`sgclip-${this.id}`}>
          <rect x={pt.x - GATE_W / 2} y={pt.y - GATE_H / 2} width={GATE_W} height={GATE_H} rx={CORNER_RX}/>
        </clipPath>
        <g clipPath={`url(#sgclip-${this.id})`}>
          {tokensInside.map((t) => {
            const tLine = lines[t.lineId]
            const tp = tLine?.points[t.pointIndex]
            if (!tp) return null
            const dx = pt.x - GATE_W / 2 + tp.x * S
            const dy = pt.y - GATE_H / 2 + tp.y * S
            const color = (t.displayColor || t.color) as string
            return miniToken(t.id, dx, dy, MINI_TOKEN_R, color, t.type === "square")
          })}
        </g>
      </g>
    )
  }

  renderMarkers = (lines: Record<string, LinePreview>, sid: string): JSX.Element | null => {
    if (this.targetScreenId !== sid) return null
    const { ENTRY_MARKER_R, EXIT_OUTER_R, EXIT_INNER_R, STROKE_WIDTH } = ScreenGatePreview
    const nodes: JSX.Element[] = []
    if (this.entryKey) {
      const [eLineId, eEp] = this.entryKey.split("::")
      const eLine = lines[eLineId]
      if (eLine) {
        const pt = eEp === "end" ? eLine.end : eLine.start
        nodes.push(<circle key={`en-${this.id}`} cx={pt.x} cy={pt.y} r={ENTRY_MARKER_R} fill={COLOR_GRAY_ACCENT}/>)
      }
    }
    if (this.exitKey) {
      const [xLineId, xEp] = this.exitKey.split("::")
      const xLine = lines[xLineId]
      if (xLine) {
        const pt = xEp === "end" ? xLine.end : xLine.start
        nodes.push(
          <g key={`ex-${this.id}`}>
            <circle cx={pt.x} cy={pt.y} r={EXIT_OUTER_R} fill="none" stroke={COLOR_GRAY_ACCENT} strokeWidth={STROKE_WIDTH}/>
            <circle cx={pt.x} cy={pt.y} r={EXIT_INNER_R} fill={COLOR_GRAY_ACCENT}/>
          </g>
        )
      }
    }
    if (nodes.length === 0) return null
    return <g key={`marker-${this.id}`}>{nodes}</g>
  }
}
