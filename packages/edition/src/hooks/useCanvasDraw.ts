import { useEffect, useRef, type RefObject } from "react"
import { EditorManager } from "@drift/engine/Manager/EditorManager"
import { StartEditor } from "@drift/engine/Start/StartEditor"
import { SwitchEditor } from "@drift/engine/Switch/SwitchEditor"
import { InverterEditor } from "@drift/engine/Inverter/InverterEditor"
import { TransformerEditor } from "@drift/engine/Transformer/TransformerEditor"
import type { TransformerType } from "@drift/engine/Transformer/Transformer"
import { ArrivalEditor } from "@drift/engine/Arrival/ArrivalEditor"
import { ScreenGateEditor } from "@drift/engine/ScreenGate/ScreenGateEditor"
import { smoothFps } from "@drift/engine/stats"
import { Canvas2DRenderer } from "@drift/canvas-render"
import type { Point } from "@drift/engine/types"

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
      new Canvas2DRenderer(ctx), hoveredLineId, snapPoint, pendingPoint, showIds,
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
