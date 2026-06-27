import type { JSX } from "react"
import { Arrival } from "./Arrival"
import { COLOR_BLACK } from "../constants"
import type { LinePreview } from "../Line/LinePreview"

export class ArrivalPreview extends Arrival {
  static readonly OUTER_R = 14
  static readonly OUTER_STROKE_WIDTH = 3
  static readonly DEMAND_R = 8
  static readonly DEMAND_SQUARE_HALF = 8
  static readonly DEMAND_SQUARE_RX = 3
  static readonly DEMAND_STROKE_WIDTH = 2

  currentDemandIndex: number = 0
  fadeAlpha: number = 1
  isFading: boolean = false

  private static demandToken = (x: number, y: number, color: string, type: string, angled: boolean, alpha: number): JSX.Element => {
    const { DEMAND_SQUARE_HALF: dsh, DEMAND_SQUARE_RX: drx, DEMAND_STROKE_WIDTH: dsw, DEMAND_R } = ArrivalPreview
    if (type === "square") {
      return (
        <rect x={x - dsh} y={y - dsh} width={dsh * 2} height={dsh * 2} rx={drx}
          fill={color} stroke={COLOR_BLACK} strokeWidth={dsw} opacity={alpha}
          transform={angled ? `rotate(45,${x},${y})` : undefined}
        />
      )
    }
    return <circle cx={x} cy={y} r={DEMAND_R} fill={color} stroke={COLOR_BLACK} strokeWidth={dsw} opacity={alpha}/>
  }

  render = (lines: Record<string, LinePreview>, sid: string): JSX.Element | null => {
    const line = lines[this.lineId]
    if (!line || line.screenId !== sid) return null
    const pt = this.endpoint === "end"
      ? line.points[line.points.length - 1]
      : line.points[0]
    if (!pt) return null
    const demand = this.demands[this.currentDemandIndex]
    const { OUTER_R, OUTER_STROKE_WIDTH } = ArrivalPreview
    return (
      <g key={this.id}>
        <circle cx={pt.x} cy={pt.y} r={OUTER_R} fill="none" stroke={COLOR_BLACK} strokeWidth={OUTER_STROKE_WIDTH}/>
        {demand && ArrivalPreview.demandToken(pt.x, pt.y, demand.color, demand.type, demand.angled, this.fadeAlpha)}
      </g>
    )
  }
}
