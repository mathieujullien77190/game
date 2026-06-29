import { useEffect, useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Svg, Defs, Filter, FeGaussianBlur, G, ColorMatrix } from "react-native-svg"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import { perf } from "engine/perf"
import { DarkOverlay } from "./DarkOverlay"
import { MiniMap } from "./MiniMap"
import type { PreviewManager } from "engine/Manager/PreviewManager"
import type { GestureResponderEvent } from "react-native"

type Props = {
  manager: PreviewManager | null
  paused: boolean
  visible: boolean
  onClick: (x: number, y: number) => void
  onTick?: () => void
}

export const SvgPreviewCanvas = ({ manager, paused, visible, onClick, onTick }: Props) => {
  const [, setTick] = useState(0)
  const lastTs = useRef<number>(0)
  const svgRef = useRef<{ width: number; height: number }>({ width: 1, height: 1 })

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

  const handleTouch = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent
    const { width, height } = svgRef.current
    // account for xMidYMid meet letterboxing: uniform scale + centering offset
    const scale = Math.min(width / CANVAS_W, height / CANVAS_H) || 1
    const offsetX = (width - CANVAS_W * scale) / 2
    const offsetY = (height - CANVAS_H * scale) / 2
    const x = (locationX - offsetX) / scale
    const y = (locationY - offsetY) / scale
    onClick(x, y)
  }

  const sid_effects = data.screenEffects[sid]
  const isInverted = sid_effects?.isInverted ?? false
  const isGrayscale = sid_effects?.isGrayscale ?? false

  // Build ColorMatrix values for invert/grayscale effects
  const filterContent = isInverted || isGrayscale ? (
    <Defs>
      <Filter id="pv-screen-filter">
        {isGrayscale && (
          <ColorMatrix
            type="saturate"
            values="0"
          />
        )}
        {isInverted && (
          <ColorMatrix
            type="matrix"
            values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"
          />
        )}
      </Filter>
    </Defs>
  ) : null

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        svgRef.current = { width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height }
      }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        preserveAspectRatio="xMidYMid meet"
        style={styles.svg}
        onPress={handleTouch}
      >
        <Defs>
          <Filter id="pv-boost-blur">
            <FeGaussianBlur stdDeviation={3} />
          </Filter>
        </Defs>

        {filterContent}

        <G filter={isInverted || isGrayscale ? "url(#pv-screen-filter)" : undefined}>
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

          {/* Transformer pulse + start ring + arrival arcs on top of tokens */}
          {Object.values(data.transformers).map((tr) => tr.renderAfter())}
          {data.start && data.start.renderAfter()}
          {data.arrival && data.arrival.renderAfter()}

          {/* Line overlays: speed badge + limitation */}
          {visibleLines.map((line) => {
            const tokens = data.tokens.filter((t) => t.lineId === line.id && !t.exploding)
            return line.renderOverlay(tokens, data.elapsedSeconds)
          })}

          {/* Tunnel dots on top */}
          {visibleLines.map((line) => line.renderTunnelDots())}

          {/* Screen gates */}
          {Object.values(data.screenGates).map((sg) =>
            sg.render(data.links, data.lines, data.tokens, data.elapsedSeconds, sid)
          )}

          {/* Inverters */}
          {Object.values(data.inverters).map((inv) => inv.render(data.links, data.lines, sid))}
        </G>

        {sid_effects?.isDark && <DarkOverlay data={data} />}
        <MiniMap data={data} />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  svg: {
    flex: 1,
  },
})
