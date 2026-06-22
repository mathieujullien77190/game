import { RefObject, useEffect } from "react"
import { PreviewManager } from "engine/Manager/PreviewManager"

export const useCanvasDrawPreview = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  manager: PreviewManager | null
) => {
  useEffect(() => {
    if (!manager) return
    const canvas = canvasRef.current
    if (!canvas) return

    let rafId: number
    const tick = (timestamp: number) => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const t0 = performance.now()
      manager.tickSim(timestamp)
      manager.drawAllPreview(ctx)
      manager.data.frameMs = performance.now() - t0
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [canvasRef, manager])
}
