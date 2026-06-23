import { RefObject, useEffect } from "react"
import { EditorManager } from "engine/Manager/EditorManager"
import { StartEditor } from "engine/Start/StartEditor"
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
  previewStartPt: Point | null,
  dpr: number
) => {
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    manager.drawAll(ctx, hoveredLineId, snapPoint, pendingPoint, showIds, starts, previewStartPt)
  }, [canvasRef, manager, revision, hoveredLineId, snapPoint, pendingPoint, showIds, starts, previewStartPt, dpr])
}
