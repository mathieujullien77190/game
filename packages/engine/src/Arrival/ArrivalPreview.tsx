import type { JSX } from "react"
import { Arrival } from "./Arrival"
import { COLOR_GRAY } from "../constants"
import type { LinePreview } from "../Line/LinePreview"

const ARC_COLOR = "#999"
const ARC_GAP = 0.05

const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number): string => {
  const x0 = cx + r * Math.cos(a0)
  const y0 = cy + r * Math.sin(a0)
  const x1 = cx + r * Math.cos(a1)
  const y1 = cy + r * Math.sin(a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${x0},${y0}A${r},${r},0,${large},1,${x1},${y1}`
}

export class ArrivalPreview extends Arrival {
  static readonly OUTER_R = 17
  static readonly OUTER_STROKE_WIDTH = 4
  static readonly DEMAND_R = 8
  static readonly DEMAND_SQUARE_HALF = 8
  static readonly DEMAND_SQUARE_RX = 3

  currentDemandIndex: number = 0
  correctCount: number = 0
  arcFill: number = 0
  arcTarget: number = 0
  flashColor: string | null = null
  flashProgress: number = 0

  private _cache: { pt: { x: number; y: number; angle: number }; lineAngle: number } | null = null

  private static demandToken = (x: number, y: number, color: string, type: string, angled: boolean): JSX.Element => {
    const { DEMAND_SQUARE_HALF: dsh, DEMAND_SQUARE_RX: drx, DEMAND_R } = ArrivalPreview
    if (type === "square") {
      return (
        <rect x={x - dsh} y={y - dsh} width={dsh * 2} height={dsh * 2} rx={drx}
          fill={color}
          transform={angled ? `rotate(45,${x},${y})` : undefined}
        />
      )
    }
    return <circle cx={x} cy={y} r={DEMAND_R} fill={color}/>
  }

  render = (lines: Record<string, LinePreview>, sid: string): JSX.Element | null => {
    const line = lines[this.lineId]
    if (!line || line.screenId !== sid) { this._cache = null; return null }
    const pt = this.endpoint === "end"
      ? line.points[line.points.length - 1]
      : line.points[0]
    if (!pt) { this._cache = null; return null }
    const lineAngle = this.endpoint === "end" ? pt.angle + Math.PI : pt.angle
    this._cache = { pt, lineAngle }
    return null
  }

  renderAfter = (): JSX.Element | null => {
    const c = this._cache
    if (!c) return null
    const { pt, lineAngle } = c
    const { OUTER_R: r, OUTER_STROKE_WIDTH: sw } = ArrivalPreview
    const n = this.demands.length
    const demand = this.demands[this.currentDemandIndex]
    const flashOpacity = this.flashColor ? (1 - this.flashProgress) * 0.55 : 0
    const elems: JSX.Element[] = []
    let firstA0: number | null = null

    elems.push(<circle key="base" cx={pt.x} cy={pt.y} r={r} fill="none" stroke={COLOR_GRAY} strokeWidth={sw}/>)

    if (this.arcFill > 0 && n > 0) {
      const segSpan = (Math.PI * 2) / n
      const gap = n > 1 ? ARC_GAP : 0
      const completedFull = Math.floor(this.arcFill)
      const partial = this.arcFill - completedFull

      for (let k = 0; k < n; k++) {
        const a0 = lineAngle + k * segSpan + gap / 2
        const a1 = lineAngle + (k + 1) * segSpan - gap / 2
        if (k < completedFull) {
          if (firstA0 === null) firstA0 = a0
          elems.push(<path key={`arc-${k}`} d={arcPath(pt.x, pt.y, r, a0, a1)} fill="none" stroke={ARC_COLOR} strokeWidth={sw} strokeLinecap="round"/>)
        } else if (k === completedFull && partial > 0) {
          if (firstA0 === null) firstA0 = a0
          const a1p = a0 + (a1 - a0) * partial
          elems.push(<path key={`arc-${k}`} d={arcPath(pt.x, pt.y, r, a0, a1p)} fill="none" stroke={ARC_COLOR} strokeWidth={sw} strokeLinecap="round"/>)
        }
      }
    }

    if (this.flashColor)
      elems.push(<circle key="flash" cx={pt.x} cy={pt.y} r={r + sw / 2} fill="none" stroke={this.flashColor} strokeWidth={sw * 2} opacity={flashOpacity}/>)

    if (demand)
      elems.push(<g key="demand">{ArrivalPreview.demandToken(pt.x, pt.y, demand.color, demand.type, demand.angled)}</g>)

    if (firstA0 !== null)
      elems.push(<circle key="dot-start" cx={pt.x + r * Math.cos(firstA0)} cy={pt.y + r * Math.sin(firstA0)} r={3} fill={ARC_COLOR}/>)

    return <g key={`aa-${this.id}`}>{elems}</g>
  }
}
