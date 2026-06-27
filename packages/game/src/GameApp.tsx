import { useEffect, useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { useGameStore } from "./store"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import { Game } from "./components/Game/Game"

const PADDING = 32

export const GameApp = () => {
  const { previewManager, loading } = useGameStore(useShallow((s) => ({ previewManager: s.previewManager, loading: s.loading })))
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.min(
        (width - PADDING * 2) / CANVAS_W,
        (height - PADDING * 2) / CANVAS_H
      ))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (loading || !previewManager) {
    return (
      <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111", color: "#666", fontFamily: "monospace" }}>
        loading...
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111" }}>
      <div style={{ position: "relative", width: CANVAS_W * scale, height: CANVAS_H * scale, borderRadius: 12, overflow: "hidden" }}>
        <Game previewManager={previewManager} />
      </div>
    </div>
  )
}
