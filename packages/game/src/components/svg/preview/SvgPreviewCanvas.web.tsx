import { useEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import { perf } from "engine/perf"
import { DarkOverlay } from "./DarkOverlay"
import { MiniMap } from "./MiniMap"
import type { PreviewManager } from "engine/Manager/PreviewManager"

type Props = {
  manager: PreviewManager | null
  paused: boolean
  visible: boolean
  cursor?: string
  onClick: ((e: MouseEvent<SVGSVGElement>) => void) | ((x: number, y: number) => void)
  onTick?: () => void
}

export const SvgPreviewCanvas = ({ manager, paused, visible, cursor = "default", onClick, onTick }: Props) => {
  const [, setTick] = useState(0)
  const lastTs = useRef<number>(0)

  useEffect(() => {
    if (!manager) return
    let raf: number
    const loop = (ts: number) => {
      const delta = ts - lastTs.current
      lastTs.current = ts
      const t0 = performance.now()
      if (!paused) manager.tickSim(ts)
      perf.compute = performance.now() - t0 // coord calc time (all tokens)
      perf.tokens = manager.data.tokens.length
      // ms = real frame time (incl. React reconcile + paint), fps derived from it
      if (delta > 0) { perf.ms = delta; perf.fps = 1000 / delta }
      setTick((t) => t + 1)
      onTick?.()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [manager, paused])

  if (!manager || !visible) return null

  const { data } = manager
  const sid = data.previewScreenId
  const visibleLines = Object.values(data.lines).filter((l) => l.screenId === sid)

  const filterStr =
    [data.screenEffects[sid]?.isInverted ? "invert(1)" : "", data.screenEffects[sid]?.isGrayscale ? "grayscale(1)" : ""]
      .filter(Boolean)
      .join(" ") || undefined

  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    if (typeof onClick === "function") {
      const fn = onClick as (e: MouseEvent<SVGSVGElement>) => void
      fn(e)
    }
  }

  return (
    <svg
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      shapeRendering="auto"
      style={{
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#f5f5f7",
        cursor,
        userSelect: "none",
      }}
      onClick={handleClick}
    >
      <defs>
        <filter id="pv-boost-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <g style={{ filter: filterStr }}>
        {visibleLines.map((line) => line.render(data.elapsedSeconds))}
        {Object.values(data.screenGates).map((sg) => sg.renderMarkers(data.lines, sid))}
        {Object.values(data.switches).map((sw) => {
          const link = data.links[sw.linkIds[0]]
          if (!link) return null
          if (data.lines[link.line1.lineId]?.screenId !== sid) return null
          return sw.render(data.lines, data.links, data.linkMap)
        })}
        {Object.values(data.transformers).map((tr) => {
          const link = data.links[tr.linkId]
          if (!link) return null
          const line = data.lines[link.line1.lineId]
          if (!line || line.screenId !== sid) return null
          const pt = link.line1.endpoint === "end" ? line.end : line.start
          return tr.render(pt, data.elapsedSeconds)
        })}
        {data.arrival && data.arrival.render(data.lines, sid)}
        {data.start && data.start.render(data.lines, data.tokens, data.elapsedSeconds, sid)}
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
        {Object.values(data.transformers).map((tr) => tr.renderAfter())}
        {data.start && data.start.renderAfter()}
        {data.arrival && data.arrival.renderAfter()}
        {visibleLines.map((line) => {
          const tokens = data.tokens.filter((t) => t.lineId === line.id && !t.exploding)
          return line.renderOverlay(tokens, data.elapsedSeconds)
        })}
        {visibleLines.map((line) => line.renderTunnelDots())}
        {Object.values(data.screenGates).map((sg) =>
          sg.render(data.links, data.lines, data.tokens, data.elapsedSeconds, sid)
        )}
        {Object.values(data.inverters).map((inv) => inv.render(data.links, data.lines, sid))}
      </g>

      {data.screenEffects[sid]?.isDark && <DarkOverlay data={data} />}
      <MiniMap data={data} />
    </svg>
  )
}
