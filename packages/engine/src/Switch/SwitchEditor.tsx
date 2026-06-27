import type { JSX } from "react"
import { Switch } from "./Switch"
import { getSwitchEnterPoint } from "./switchUtils"
import type { Link } from "../Link/Link"
import type { LineEditor } from "../Line/LineEditor"

export class SwitchEditor extends Switch {
  static readonly RADIUS = 18
  static readonly COLOR = "#7c3aed"
  static readonly OPACITY_DEFAULT = 0.4

  constructor(id?: string, linkIds?: string[], activeLinkId?: string | null, screenId?: string) {
    super(id, linkIds, activeLinkId, screenId)
  }

  render = (links: Record<string, Link>, lines: Record<string, LineEditor>, hovered: boolean): JSX.Element | null => {
    const ep = getSwitchEnterPoint(this.linkIds, links)
    if (!ep) return null
    const line = lines[ep.lineId]
    if (!line) return null
    const pt = ep.endpoint === "end" ? line.end : line.start
    const { RADIUS, COLOR, OPACITY_DEFAULT } = SwitchEditor
    return (
      <circle key={this.id} cx={pt.x} cy={pt.y} r={RADIUS} fill={COLOR} opacity={hovered ? 1 : OPACITY_DEFAULT}/>
    )
  }
}
