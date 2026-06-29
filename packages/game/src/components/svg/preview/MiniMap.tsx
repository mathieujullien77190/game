import * as SVG from "engine/svgElements"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import { miniToken } from "engine/miniToken"
import type { PreviewManager } from "engine/Manager/PreviewManager"

export const MiniMap = ({ data }: { data: PreviewManager["data"] }) => {
  const prevSid = data.previewScreenHistory.at(-1)
  if (!prevSid) return null
  const S = 0.1
  const MW = CANVAS_W * S,
    MH = CANVAS_H * S
  const mx = CANVAS_W - MW - 8,
    my = CANVAS_H - MH - 8

  return (
    <SVG.g>
      <SVG.rect x={mx} y={my} width={MW} height={MH} rx={4} fill="#fff" stroke="#ccc" strokeWidth={4} />
      {data.tokens.map((token) => {
        if (data.elapsedSeconds < token.startAt) return null
        const line = data.lines[token.lineId]
        if (!line || line.screenId !== prevSid) return null
        const pt = line.points[token.pointIndex]
        if (!pt) return null
        const dx = mx + pt.x * S,
          dy = my + pt.y * S
        const color = (token.displayColor || token.color) as string
        return miniToken(token.id, dx, dy, 3, color, token.type === "square")
      })}
    </SVG.g>
  )
}
