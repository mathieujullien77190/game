import { useEffect, useRef, type RefObject } from "react"
import { EditorManager } from "engine/Manager/EditorManager"
import { StartEditor } from "engine/Start/StartEditor"
import { SwitchEditor } from "engine/Switch/SwitchEditor"
import { RotatorEditor } from "engine/Rotator/RotatorEditor"
import { PainterEditor } from "engine/Painter/PainterEditor"
import { smoothFps } from "engine/stats"
import type { Point } from "engine/types"

export const useCanvasDraw = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  manager: EditorManager,
  revision: number,
  hoveredLineId: string | null,
  snapPoint: Point | null,
  pendingPoint: Point | null,
  showIds: boolean,
  starts: StartEditor[],
  switches: SwitchEditor[],
  previewStartPt: Point | null,
  previewSwitchPt: Point | null,
  dpr: number,
  hoveredSwitchId: string | null,
  rotators: RotatorEditor[] = [],
  hoveredRotatorId: string | null = null,
  previewRotatorPt: Point | null = null,
  painters: PainterEditor[] = [],
  hoveredPainterId: string | null = null,
  previewPainterPt: Point | null = null
) => {
  const lastTimestampRef = useRef<number | null>(null)
  const fpsRef = useRef(0)
  const frameMsRef = useRef(0)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const t0 = performance.now()
    const last = lastTimestampRef.current
    if (last !== null) {
      fpsRef.current = smoothFps(fpsRef.current, t0 - last)
    }
    lastTimestampRef.current = t0
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    manager.drawAll(
      ctx, hoveredLineId, snapPoint, pendingPoint, showIds,
      starts, switches, previewStartPt, previewSwitchPt,
      fpsRef.current, frameMsRef.current, hoveredSwitchId, rotators,
      hoveredRotatorId, previewRotatorPt, painters, hoveredPainterId, previewPainterPt
    )
    frameMsRef.current = performance.now() - t0
  }, [canvasRef, manager, revision, hoveredLineId, snapPoint, pendingPoint, showIds, starts, switches, previewStartPt, previewSwitchPt, dpr, hoveredSwitchId, rotators, hoveredRotatorId, previewRotatorPt, painters, hoveredPainterId, previewPainterPt])
}
