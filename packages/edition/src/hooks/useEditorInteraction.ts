import { useCallback, useRef, useState } from "react"
import { LineEditor } from "@drift/engine/entities/Line/LineEditor"
import { StartEditor } from "@drift/engine/entities/Start/StartEditor"
import { SwitchEditor } from "@drift/engine/entities/Switch/SwitchEditor"
import type { EditorManager } from "@drift/engine/Manager/EditorManager"
import type { LineType } from "@drift/engine/entities/Line/Line"
import type { TransformerType } from "@drift/engine/entities/Transformer/Transformer"
import { CANVAS_H, CANVAS_W, GRID_SIZE } from "@drift/engine/constants"
import { distance } from "@drift/engine/Utils/geometry"
import type { Point } from "@drift/engine/types"
import type { Mode } from "store/types"

const HIT_RADIUS = 10

const snapToGrid = (p: Point): Point => ({
  x: Math.round(p.x / GRID_SIZE) * GRID_SIZE,
  y: Math.round(p.y / GRID_SIZE) * GRID_SIZE,
})

const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
  const rect = e.currentTarget.getBoundingClientRect()
  return {
    x: (e.clientX - rect.left) * (CANVAS_W / rect.width),
    y: (e.clientY - rect.top) * (CANVAS_H / rect.height),
  }
}

const findElbowFlipAt = (lines: LineEditor[], point: Point) => {
  for (const line of lines) {
    if (line.type !== "elbow") continue
    const corner = line.flip ? { x: line.end.x, y: line.start.y } : { x: line.start.x, y: line.end.y }
    if (distance(point, corner) <= HIT_RADIUS) return line.id
  }
  return null
}

const findControlPointAt = (lines: LineEditor[], point: Point) => {
  for (const line of lines) {
    if (line.type !== "curve") continue
    if (distance(point, line.cp1) <= HIT_RADIUS) return { lineId: line.id, cp: "cp1" as const }
    if (distance(point, line.cp2) <= HIT_RADIUS) return { lineId: line.id, cp: "cp2" as const }
  }
  return null
}

const findEndpointAt = (lines: LineEditor[], point: Point) => {
  for (const line of lines) {
    if (distance(point, line.start) <= HIT_RADIUS)
      return { lineId: line.id, endpoint: "start" as const }
    if (distance(point, line.end) <= HIT_RADIUS)
      return { lineId: line.id, endpoint: "end" as const }
  }
  return null
}

type EndpointSnap = { lineId: string; endpoint: "start" | "end"; pt: Point } | null

interface Params {
  mode: Mode
  editorManager: EditorManager
  currentScreenId: string
  pendingPoint: Point | null
  pendingTransformerType: TransformerType
  lineType: LineType
  linePreset: "arc" | null
  addLine: (line: LineEditor) => void
  addStart: (start: StartEditor) => void
  addSwitch: (sw: SwitchEditor) => void
  addTransformer: (linkId: string, type: TransformerType) => void
  addArrival: (lineId: string, endpoint: "start" | "end") => void
  addInverter: (linkId: string) => void
  addScreenGate: (linkId: string) => void
  setPendingPoint: (point: Point | null) => void
  setMode: (mode: Mode) => void
  setLinePreset: (preset: "arc" | null) => void
  toggleLineFlip: (id: string) => void
  updateLineEndpoint: (id: string, endpoint: "start" | "end", point: Point) => void
  updateLineControlPoint: (id: string, cp: "cp1" | "cp2", point: Point) => void
  setHoveredLineId: (id: string | null) => void
}

export const useEditorInteraction = ({
  mode, editorManager, currentScreenId, pendingPoint, pendingTransformerType, lineType, linePreset,
  addLine, addStart, addSwitch, addTransformer, addArrival, addInverter, addScreenGate,
  setPendingPoint, setMode, setLinePreset, toggleLineFlip, updateLineEndpoint, updateLineControlPoint, setHoveredLineId,
}: Params) => {
  const [snapPoint, setSnapPoint] = useState<Point | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverNearEndpoint, setHoverNearEndpoint] = useState(false)
  const [addStartSnap, setAddStartSnap] = useState<EndpointSnap>(null)
  const [addSwitchSnap, setAddSwitchSnap] = useState<EndpointSnap>(null)
  const [addTransformerSnap, setAddTransformerSnap] = useState<EndpointSnap>(null)
  const [addArrivalSnap, setAddArrivalSnap] = useState<EndpointSnap>(null)
  const [addInverterSnap, setAddInverterSnap] = useState<EndpointSnap>(null)
  const [addScreenGateSnap, setAddScreenGateSnap] = useState<EndpointSnap>(null)

  const draggingEndpoint = useRef<{ lineId: string; endpoint: "start" | "end" } | null>(null)
  const draggingCP = useRef<{ lineId: string; cp: "cp1" | "cp2" } | null>(null)

  const onCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "select") return
    const point = getCanvasPoint(e)
    const lines = Object.values(editorManager.data.lines).filter((l) => l.screenId === currentScreenId)
    const cpHit = findControlPointAt(lines, point)
    if (cpHit) {
      draggingCP.current = cpHit
      setIsDragging(true)
      return
    }
    const hit = findEndpointAt(lines, point)
    if (hit) {
      draggingEndpoint.current = hit
      setIsDragging(true)
    }
  }, [mode, editorManager, currentScreenId])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const raw = getCanvasPoint(e)
    const point = snapToGrid(raw)
    if (draggingCP.current) {
      updateLineControlPoint(draggingCP.current.lineId, draggingCP.current.cp, raw)
      return
    }
    if (draggingEndpoint.current) {
      updateLineEndpoint(draggingEndpoint.current.lineId, draggingEndpoint.current.endpoint, point)
    } else if (mode === "addStart") {
      const hit = findEndpointAt(Object.values(editorManager.data.lines), raw)
      if (hit) {
        const line = editorManager.data.lines[hit.lineId]
        setAddStartSnap({ lineId: hit.lineId, endpoint: hit.endpoint, pt: line[hit.endpoint] })
        setHoverNearEndpoint(true)
      } else {
        setAddStartSnap(null)
        setHoverNearEndpoint(false)
      }
    } else if (mode === "addSwitch") {
      const hit = findEndpointAt(Object.values(editorManager.data.lines), raw)
      if (hit) {
        const line = editorManager.data.lines[hit.lineId]
        setAddSwitchSnap({ lineId: hit.lineId, endpoint: hit.endpoint, pt: line[hit.endpoint] })
        setHoverNearEndpoint(true)
      } else {
        setAddSwitchSnap(null)
        setHoverNearEndpoint(false)
      }
    } else if (mode === "addTransformer") {
      const hit = findEndpointAt(Object.values(editorManager.data.lines), raw)
      if (hit) {
        const line = editorManager.data.lines[hit.lineId]
        setAddTransformerSnap({ lineId: hit.lineId, endpoint: hit.endpoint, pt: line[hit.endpoint] })
        setHoverNearEndpoint(true)
      } else {
        setAddTransformerSnap(null)
        setHoverNearEndpoint(false)
      }
    } else if (mode === "addArrival") {
      const hit = findEndpointAt(Object.values(editorManager.data.lines), raw)
      if (hit) {
        const line = editorManager.data.lines[hit.lineId]
        setAddArrivalSnap({ lineId: hit.lineId, endpoint: hit.endpoint, pt: line[hit.endpoint] })
        setHoverNearEndpoint(true)
      } else {
        setAddArrivalSnap(null)
        setHoverNearEndpoint(false)
      }
    } else if (mode === "addInverter") {
      const hit = findEndpointAt(Object.values(editorManager.data.lines), raw)
      if (hit) {
        const line = editorManager.data.lines[hit.lineId]
        setAddInverterSnap({ lineId: hit.lineId, endpoint: hit.endpoint, pt: line[hit.endpoint] })
        setHoverNearEndpoint(true)
      } else {
        setAddInverterSnap(null)
        setHoverNearEndpoint(false)
      }
    } else if (mode === "addScreenGate") {
      const screenLines = Object.values(editorManager.data.lines).filter((l) => l.screenId === currentScreenId)
      const hit = findEndpointAt(screenLines, raw)
      if (hit) {
        const line = editorManager.data.lines[hit.lineId]
        setAddScreenGateSnap({ lineId: hit.lineId, endpoint: hit.endpoint, pt: line[hit.endpoint] })
        setHoverNearEndpoint(true)
      } else {
        setAddScreenGateSnap(null)
        setHoverNearEndpoint(false)
      }
    } else {
      setSnapPoint(point)
      if (mode === "select") {
        setHoverNearEndpoint(findEndpointAt(Object.values(editorManager.data.lines), raw) !== null)
        const HIT_R = 8
        const found = Object.values(editorManager.data.lines).find((line) =>
          line.points.some((pt) => {
            const dx = pt.x - raw.x; const dy = pt.y - raw.y
            return dx * dx + dy * dy <= HIT_R * HIT_R
          })
        )
        setHoveredLineId(found?.id ?? null)
      }
    }
  }, [mode, editorManager, currentScreenId, updateLineEndpoint, updateLineControlPoint, setHoveredLineId])

  const onCanvasMouseUp = useCallback(() => {
    draggingEndpoint.current = null
    draggingCP.current = null
    setIsDragging(false)
  }, [])

  const onMouseLeave = useCallback(() => {
    setSnapPoint(null)
    setAddStartSnap(null)
    setAddSwitchSnap(null)
    setAddTransformerSnap(null)
    setAddArrivalSnap(null)
    setAddInverterSnap(null)
    setAddScreenGateSnap(null)
    setHoverNearEndpoint(false)
    setHoveredLineId(null)
    draggingEndpoint.current = null
    draggingCP.current = null
    setIsDragging(false)
  }, [setHoveredLineId])

  const onCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mode === "addStart") {
        if (addStartSnap) {
          addStart(new StartEditor(addStartSnap.lineId, addStartSnap.endpoint, undefined, undefined, currentScreenId))
          setAddStartSnap(null)
          setMode("select")
        }
        return
      }
      if (mode === "addSwitch") {
        if (addSwitchSnap) {
          const linkIds = Object.values(editorManager.data.links)
            .filter((lk) =>
              (lk.line1.lineId === addSwitchSnap.lineId && lk.line1.endpoint === addSwitchSnap.endpoint) ||
              (lk.line2.lineId === addSwitchSnap.lineId && lk.line2.endpoint === addSwitchSnap.endpoint)
            )
            .map((lk) => lk.id)
          addSwitch(new SwitchEditor(undefined, linkIds, linkIds[0] ?? null, currentScreenId))
          setAddSwitchSnap(null)
          setMode("select")
        }
        return
      }
      if (mode === "addTransformer") {
        if (addTransformerSnap) {
          const linkId = Object.values(editorManager.data.links).find((lk) =>
            (lk.line1.lineId === addTransformerSnap.lineId && lk.line1.endpoint === addTransformerSnap.endpoint) ||
            (lk.line2.lineId === addTransformerSnap.lineId && lk.line2.endpoint === addTransformerSnap.endpoint)
          )?.id
          if (linkId) {
            addTransformer(linkId, pendingTransformerType)
            setAddTransformerSnap(null)
            setMode("select")
          }
        }
        return
      }
      if (mode === "addArrival") {
        if (addArrivalSnap) {
          addArrival(addArrivalSnap.lineId, addArrivalSnap.endpoint)
          setAddArrivalSnap(null)
          setMode("select")
        }
        return
      }
      if (mode === "addInverter") {
        if (addInverterSnap) {
          const linkId = Object.values(editorManager.data.links).find((lk) =>
            (lk.line1.lineId === addInverterSnap.lineId && lk.line1.endpoint === addInverterSnap.endpoint) ||
            (lk.line2.lineId === addInverterSnap.lineId && lk.line2.endpoint === addInverterSnap.endpoint)
          )?.id
          if (linkId) {
            addInverter(linkId)
            setAddInverterSnap(null)
            setMode("select")
          }
        }
        return
      }
      if (mode === "addScreenGate") {
        if (addScreenGateSnap) {
          const linkId = Object.values(editorManager.data.links).find((lk) =>
            (lk.line1.lineId === addScreenGateSnap.lineId && lk.line1.endpoint === addScreenGateSnap.endpoint) ||
            (lk.line2.lineId === addScreenGateSnap.lineId && lk.line2.endpoint === addScreenGateSnap.endpoint)
          )?.id
          if (linkId) {
            addScreenGate(linkId)
            setAddScreenGateSnap(null)
            setMode("select")
          }
        }
        return
      }
      if (mode === "select") {
        const pt = getCanvasPoint(e)
        const lines = Object.values(editorManager.data.lines).filter((l) => l.screenId === currentScreenId)
        const flipId = findElbowFlipAt(lines, pt)
        if (flipId) { toggleLineFlip(flipId); return }
      }
      if (mode !== "addLine") return
      const point = snapToGrid(getCanvasPoint(e))
      if (!pendingPoint) {
        setPendingPoint(point)
      } else {
        const k = 0.5523
        const cp1 = linePreset === "arc" ? { x: pendingPoint.x + k * (point.x - pendingPoint.x), y: pendingPoint.y } : undefined
        const cp2 = linePreset === "arc" ? { x: point.x, y: point.y - k * (point.y - pendingPoint.y) } : undefined
        addLine(new LineEditor(pendingPoint, point, lineType, undefined, cp1, cp2, currentScreenId))
        if (linePreset) setLinePreset(null)
        setPendingPoint(null)
        setMode("select")
      }
    },
    [mode, pendingPoint, pendingTransformerType, addStartSnap, addSwitchSnap, addTransformerSnap, addArrivalSnap, addInverterSnap, addScreenGateSnap, lineType, linePreset, addLine, addStart, addSwitch, addTransformer, addInverter, addScreenGate, addArrival, setPendingPoint, setMode, setLinePreset, toggleLineFlip, editorManager, currentScreenId]
  )

  const canvasCursor = mode === "addLine"
    ? "none"
    : (mode === "addStart" || mode === "addSwitch" || mode === "addTransformer" || mode === "addArrival" || mode === "addInverter" || mode === "addScreenGate")
      ? (hoverNearEndpoint ? "pointer" : "crosshair")
      : isDragging
      ? "grabbing"
      : hoverNearEndpoint
        ? "grab"
        : "crosshair"

  return {
    snapPoint, isDragging, hoverNearEndpoint,
    addStartSnap, addSwitchSnap, addTransformerSnap, addArrivalSnap, addInverterSnap, addScreenGateSnap,
    onCanvasMouseDown, onMouseMove, onCanvasMouseUp, onMouseLeave, onCanvasClick,
    canvasCursor,
  }
}
