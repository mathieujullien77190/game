import type { JSX } from "react"
import { Arrival } from "./Arrival"
import type { LineEditor } from "../Line/LineEditor"

export class ArrivalEditor extends Arrival {
  static readonly OUTER_R = 14
  static readonly DEMAND_R = 8
  static readonly DEMAND_SQUARE_HALF = 8
  static readonly DEMAND_SQUARE_RX = 3
  static readonly DEMAND_STROKE_WIDTH = 2
  static readonly EMPTY_SQUARE_HALF = 5

  render = (lines: Record<string, LineEditor>): JSX.Element | null => {
    const line = lines[this.lineId]
    if (!line) return null
    const pt = this.endpoint === "end" ? line.end : line.start
    const demand = this.demands[0]
    const { OUTER_R, DEMAND_R, DEMAND_SQUARE_HALF: dsh, DEMAND_SQUARE_RX: drx, DEMAND_STROKE_WIDTH: dsw, EMPTY_SQUARE_HALF: esh } = ArrivalEditor
    return (
      <g key={this.id}>
        <circle cx={pt.x} cy={pt.y} r={OUTER_R} fill="#000"/>
        {!demand && (
          <rect x={pt.x - esh} y={pt.y - esh} width={esh * 2} height={esh * 2} fill="#fff"/>
        )}
        {demand && demand.type === "square" && (
          <rect
            x={pt.x - dsh} y={pt.y - dsh} width={dsh * 2} height={dsh * 2} rx={drx}
            fill={demand.color} stroke="#000" strokeWidth={dsw}
            transform={demand.angled ? `rotate(45,${pt.x},${pt.y})` : undefined}
          />
        )}
        {demand && demand.type !== "square" && (
          <circle cx={pt.x} cy={pt.y} r={DEMAND_R} fill={demand.color} stroke="#000" strokeWidth={dsw}/>
        )}
      </g>
    )
  }
}
