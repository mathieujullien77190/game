import { useEffect, useRef, type RefObject } from "react"
import { EditorManager } from "engine/Manager/EditorManager"
import { StartEditor } from "engine/Start/StartEditor"
import { SwitchEditor } from "engine/Switch/SwitchEditor"
import { InverterEditor } from "engine/Inverter/InverterEditor"
import { TransformerEditor } from "engine/Transformer/TransformerEditor"
import type { TransformerType } from "engine/Transformer/Transformer"
import { ArrivalEditor } from "engine/Arrival/ArrivalEditor"
import { ScreenGateEditor } from "engine/ScreenGate/ScreenGateEditor"
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
  transformers: TransformerEditor[] = [],
  hoveredTransformerId: string | null = null,
  previewTransformerPt: Point | null = null,
  previewTransformerType: TransformerType | null = null,
  inverters: InverterEditor[] = [],
  hoveredInverterId: string | null = null,
  previewInverterPt: Point | null = null,
  arrival: ArrivalEditor | null = null,
  previewArrivalPt: Point | null = null,
  screenGates: ScreenGateEditor[] = [],
  hoveredScreenGateId: string | null = null,
  previewScreenGatePt: Point | null = null,
  screenGateMarkers: { entryKey: string; exitKey: string }[] = [],
  visibleLineIds?: Set<string>,
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
      fpsRef.current, frameMsRef.current, hoveredSwitchId,
      transformers, hoveredTransformerId, previewTransformerPt, previewTransformerType,
      inverters, hoveredInverterId, previewInverterPt,
      arrival, previewArrivalPt,
      screenGates, hoveredScreenGateId, previewScreenGatePt,
      screenGateMarkers,
      visibleLineIds
    )
    frameMsRef.current = performance.now() - t0
  }, [canvasRef, manager, revision, hoveredLineId, snapPoint, pendingPoint, showIds, starts, switches, previewStartPt, previewSwitchPt, dpr, hoveredSwitchId, transformers, hoveredTransformerId, previewTransformerPt, previewTransformerType, inverters, hoveredInverterId, previewInverterPt, arrival, previewArrivalPt, screenGates, hoveredScreenGateId, previewScreenGatePt, screenGateMarkers, visibleLineIds])
}
