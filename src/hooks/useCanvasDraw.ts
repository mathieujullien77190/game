import { RefObject, useEffect } from "react"
import { EditorManager } from "engine/Manager/EditorManager"
import type { Start } from "engine/Start/Start"
import type { Point } from "engine/types"

export const useCanvasDraw = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  manager: EditorManager,
  revision: number,
  hoveredLineId: string | null,
  snapPoint: Point | null,
  pendingPoint: Point | null,
  showIds: boolean,
  start: Start | null,
  previewStartPt: Point | null
) => {
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    manager.drawAll(ctx, hoveredLineId, snapPoint, pendingPoint, showIds, start, previewStartPt)
  }, [canvasRef, manager, revision, hoveredLineId, snapPoint, pendingPoint, showIds, start, previewStartPt])
}
