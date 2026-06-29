import * as SVG from "engine/svgElements"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import type { PreviewManager } from "engine/Manager/PreviewManager"

export const DarkOverlay = ({ data }: { data: PreviewManager["data"] }) => {
  const sid = data.previewScreenId
  const punches: Array<{ x: number; y: number; r: number }> = []

  for (const token of data.tokens) {
    if (data.elapsedSeconds < token.startAt || token.exploding) continue
    const line = data.lines[token.lineId]
    if (!line || line.screenId !== sid || line.tunnel) continue
    const pt = line.points[token.pointIndex]
    if (pt) punches.push({ x: pt.x, y: pt.y, r: 50 })
  }
  for (const sw of Object.values(data.switches)) {
    const pt = sw.getPoint()
    if (pt) punches.push({ x: pt.x, y: pt.y, r: 40 })
  }
  if (data.start) {
    const line = data.lines[data.start.lineId]
    if (line && line.screenId === sid) {
      const pt =
        data.start.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0]
      if (pt) punches.push({ x: pt.x, y: pt.y, r: 35 })
    }
  }
  if (data.arrival) {
    const line = data.lines[data.arrival.lineId]
    if (line && line.screenId === sid) {
      const pt =
        data.arrival.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0]
      if (pt) punches.push({ x: pt.x, y: pt.y, r: 35 })
    }
  }
  for (const sg of Object.values(data.screenGates)) {
    if (sg.screenId !== sid) continue
    const link = data.links[sg.linkId]
    if (!link) continue
    const line = data.lines[link.line1.lineId]
    if (!line) continue
    const pt = link.line1.endpoint === "end" ? line.end : line.start
    punches.push({ x: pt.x, y: pt.y, r: 30 })
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
      <SVG.defs>
        <SVG.filter
          id="pv-dark-holes"
          filterUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={CANVAS_W}
          height={CANVAS_H}
        >
          <SVG.feGaussianBlur stdDeviation={20} />
          <SVG.feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 20 -7" />
        </SVG.filter>
        <SVG.mask id="pv-dark-mask">
          <SVG.rect width={CANVAS_W} height={CANVAS_H} fill="white" />
          <SVG.g filter="url(#pv-dark-holes)">
            {punches.map((p, i) => (
              <SVG.circle key={i} cx={p.x} cy={p.y} r={p.r} fill="black" />
            ))}
          </SVG.g>
        </SVG.mask>
      </SVG.defs>
      <SVG.rect width={CANVAS_W} height={CANVAS_H} fill="black" mask="url(#pv-dark-mask)" />
    </>
  )
}
