import { useEffect, useState } from "react"
import type { MouseEvent } from "react"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import { DarkOverlay } from "./DarkOverlay"
import { MiniMap } from "./MiniMap"
import type { PreviewManager } from "engine/Manager/PreviewManager"

type Props = {
  manager: PreviewManager | null
  paused: boolean
  visible: boolean
  cursor: string
  onClick: (e: MouseEvent<SVGSVGElement>) => void
}

export const SvgPreviewCanvas = ({ manager, paused, visible, cursor, onClick }: Props) => {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!manager) return
    let raf: number
    const loop = (ts: number) => {
      const t0 = performance.now()
      if (!paused) manager.tickSim(ts)
      manager.data.frameMs = performance.now() - t0
      setTick((t) => t + 1)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [manager, paused])

  if (!manager || !visible) return null

  const { data } = manager
  const sid = data.previewScreenId
  const visibleLines = Object.values(data.lines).filter((l) => l.screenId === sid)

  const filterStr = [
    data.isInverted ? "invert(1)" : "",
    data.isGrayscale ? "grayscale(1)" : "",
  ].filter(Boolean).join(" ") || undefined

  return (
    <svg
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      style={{ display: "block", position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#fff", cursor, userSelect: "none" }}
      onClick={onClick}
    >
      <defs>
        <filter id="pv-boost-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
      </defs>

      <g style={{ filter: filterStr }}>
        {/* Switch links */}
        {(() => {
          if (Object.keys(data.switchLinks).length === 0) return null
          const drawn = new Set<string>()
          return Object.entries(data.switchLinks).flatMap(([swId, linked]) =>
            linked.flatMap((otherId) => {
              const key = swId < otherId ? `${swId}:${otherId}` : `${otherId}:${swId}`
              if (drawn.has(key)) return []
              drawn.add(key)
              const pa = data.switches[swId]?.getPoint()
              const pb = data.switches[otherId]?.getPoint()
              if (!pa || !pb) return []
              return [
                <line key={key}
                  x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                  stroke="#ccc" strokeWidth={7} strokeDasharray="6 22" strokeLinecap="square"
                />
              ]
            })
          )
        })()}

        {/* Lines */}
        {visibleLines.map((line) => line.render(data.elapsedSeconds))}

        {/* Screen gate entry/exit markers */}
        {Object.values(data.screenGates).map((sg) => sg.renderMarkers(data.lines, sid))}

        {/* Switches */}
        {Object.values(data.switches).map((sw) => {
          const link = data.links[sw.linkIds[0]]
          if (!link) return null
          if (data.lines[link.line1.lineId]?.screenId !== sid) return null
          return sw.render(data.lines, data.links, data.linkMap)
        })}

        {/* Transformers */}
        {Object.values(data.transformers).map((tr) => {
          const link = data.links[tr.linkId]
          if (!link) return null
          const line = data.lines[link.line1.lineId]
          if (!line || line.screenId !== sid) return null
          const pt = link.line1.endpoint === "end" ? line.end : line.start
          return tr.render(pt, data.elapsedSeconds)
        })}

        {/* Arrival */}
        {data.arrival && data.arrival.render(data.lines, sid)}

        {/* Start */}
        {data.start && data.start.render(data.lines, data.tokens, data.elapsedSeconds, sid)}

        {/* Tokens */}
        {data.tokens.map((token) => {
          if (data.elapsedSeconds < token.startAt) return null
          const tokenScreenId = data.lines[token.lineId]?.screenId ?? "main"
          if (tokenScreenId !== sid) return null
          const line = data.lines[token.lineId]
          if (!line || line.points.length === 0 || line.tunnel) return null
          const pt = line.points[token.pointIndex]
          if (!pt) return null
          return token.render(pt, line)
        })}

        {/* Line overlays: speed badge + limitation */}
        {visibleLines.map((line) => {
          const token = data.tokens.find((t) => t.lineId === line.id && !t.exploding)
          return line.renderOverlay(token)
        })}

        {/* Screen gates */}
        {Object.values(data.screenGates).map((sg) =>
          sg.render(data.links, data.lines, data.tokens, data.elapsedSeconds, sid)
        )}

        {/* Inverters */}
        {Object.values(data.inverters).map((inv) => inv.render(data.links, data.lines, sid))}
      </g>

      {data.isDark && <DarkOverlay data={data}/>}
      <MiniMap data={data}/>
      <text x={8} y={CANVAS_H - 8}
        fontFamily="monospace" fontSize={11} fontWeight="bold" fill="#333">
        {Math.round(data.fps)} fps  {Math.ceil(data.frameMs)}ms
      </text>
    </svg>
  )
}
