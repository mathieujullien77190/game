import type { Point } from "engine/types"

type Props = {
  pendingPoint: Point | null
  snapPoint: Point | null
}

export const SvgPendingLine = ({ pendingPoint, snapPoint }: Props) => (
  <>
    {pendingPoint && snapPoint && (
      <line
        x1={pendingPoint.x} y1={pendingPoint.y}
        x2={snapPoint.x} y2={snapPoint.y}
        stroke="#999" strokeWidth={2} strokeDasharray="6 5" strokeLinecap="round"
      />
    )}
    {pendingPoint && (
      <circle cx={pendingPoint.x} cy={pendingPoint.y} r={5} fill="#f9ab00"/>
    )}
    {snapPoint && (
      <circle
        cx={snapPoint.x} cy={snapPoint.y}
        r={pendingPoint ? 7 : 5}
        fill={pendingPoint ? "#1a73e8" : "#f9ab00"}
      />
    )}
  </>
)
