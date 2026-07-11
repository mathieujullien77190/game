import { useEffect, useState, type RefObject } from "react"
import { CANVAS_H, CANVAS_W } from "@drift/engine/constants"

const PADDING = 24

export const useCanvasScale = (containerRef: RefObject<HTMLDivElement | null>, dpr: number) => {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const raw = Math.min(
        (width - PADDING * 2) / CANVAS_W,
        (height - PADDING * 2) / CANVAS_H
      )
      const snapped = Math.round(raw * dpr) / dpr
      setScale(Math.max(1 / dpr, snapped))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return scale
}
