import type { JSX } from "react"
import { Transformer } from "./Transformer"
import type { Link } from "../Link/Link"
import type { LineEditor } from "../Line/LineEditor"

export const TRANSFORMER_COLORS: Record<string, string> = {
  fade: "#546e7a",
  rotate: "#00ACC1",
  color: "#7B1FA2",
  shape: "#2e7d32",
}

export class TransformerEditor extends Transformer {
  static readonly RADIUS = 18
  static readonly OPACITY_DEFAULT = 0.4

  render = (links: Record<string, Link>, lines: Record<string, LineEditor>, hovered: boolean): JSX.Element | null => {
    const link = links[this.linkId]
    if (!link) return null
    const line = lines[link.line1.lineId]
    if (!line) return null
    const pt = link.line1.endpoint === "end" ? line.end : line.start
    const { RADIUS, OPACITY_DEFAULT } = TransformerEditor
    return (
      <circle key={this.id}
        cx={pt.x} cy={pt.y} r={RADIUS}
        fill={TRANSFORMER_COLORS[this.type] ?? "#888"}
        opacity={hovered ? 1 : OPACITY_DEFAULT}
      />
    )
  }
}
