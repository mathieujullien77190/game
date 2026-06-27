import { CANVAS_W, CANVAS_H } from "engine/constants"
import type { PreviewManager } from "engine/Manager/PreviewManager"

export const DarkOverlay = ({ data }: { data: PreviewManager["data"] }) => {
  const sid = data.previewScreenId
  const punches: Array<{ x: number; y: number; r: number }> = []

  for (const token of data.tokens) {
    if (data.elapsedSeconds < token.startAt || token.exploding) continue
    const line = data.lines[token.lineId]
    const pt = line?.points[token.pointIndex]
    if (pt) punches.push({ x: pt.x, y: pt.y, r: 50 })
  }
  for (const sw of Object.values(data.switches)) {
    const pt = sw.getPoint()
    if (pt) punches.push({ x: pt.x, y: pt.y, r: 40 })
  }
  if (data.start) {
    const line = data.lines[data.start.lineId]
    if (line && line.screenId === sid) {
      const pt = data.start.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0]
      if (pt) punches.push({ x: pt.x, y: pt.y, r: 35 })
    }
  }
  if (data.arrival) {
    const line = data.lines[data.arrival.lineId]
    if (line && line.screenId === sid) {
      const pt = data.arrival.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0]
      if (pt) punches.push({ x: pt.x, y: pt.y, r: 35 })
    }
  }
  for (const tr of Object.values(data.transformers)) {
    const link = data.links[tr.linkId]
    if (!link) continue
    const line = data.lines[link.line1.lineId]
    if (line?.screenId !== sid) continue
    const pt = link.line1.endpoint === "end" ? line.end : line.start
    punches.push({ x: pt.x, y: pt.y, r: 25 })
  }

  return (
    <>
      <defs>
        <mask id="pv-dark-mask">
          <rect width={CANVAS_W} height={CANVAS_H} fill="black"/>
          {punches.map((p, i) => (
            <radialGradient key={i} id={`pv-dg-${i}`}
              cx={p.x} cy={p.y} r={p.r} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity={1}/>
              <stop offset="60%" stopColor="white" stopOpacity={0.85}/>
              <stop offset="100%" stopColor="white" stopOpacity={0}/>
            </radialGradient>
          ))}
          {punches.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={`url(#pv-dg-${i})`}/>
          ))}
        </mask>
      </defs>
      <rect width={CANVAS_W} height={CANVAS_H} fill="rgba(0,0,0,0.96)" mask="url(#pv-dark-mask)"/>
    </>
  )
}
