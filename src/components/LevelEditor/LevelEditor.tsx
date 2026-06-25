import { useCallback, useEffect, useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { LineEditor } from "engine/Line/LineEditor"
import { StartEditor } from "engine/Start/StartEditor"
import { SwitchEditor } from "engine/Switch/SwitchEditor"
import { RotatorEditor } from "engine/Rotator/RotatorEditor"
import { PainterEditor } from "engine/Painter/PainterEditor"
import { FaderEditor } from "engine/Fader/FaderEditor"
import { InverterEditor } from "engine/Inverter/InverterEditor"
import { ArrivalEditor } from "engine/Arrival/ArrivalEditor"
import { CANVAS_H, CANVAS_W, GRID_SIZE } from "engine/constants"
import type { Point } from "engine/types"
import { useStore } from "store"
import { useCanvasDraw } from "hooks/useCanvasDraw"
import { useCanvasDrawPreview } from "hooks/useCanvasDrawPreview"
import * as S from "./UI"
import ToolsPanel from "components/ToolsPanel"

const PADDING = 24
const HIT_RADIUS = 10

const snapToGrid = (p: Point): Point => ({
  x: Math.round(p.x / GRID_SIZE) * GRID_SIZE,
  y: Math.round(p.y / GRID_SIZE) * GRID_SIZE,
})

const findControlPointAt = (lines: LineEditor[], point: Point) => {
  for (const line of lines) {
    if (line.type !== "curve") continue
    const d1x = point.x - line.cp1.x; const d1y = point.y - line.cp1.y
    if (Math.sqrt(d1x * d1x + d1y * d1y) <= HIT_RADIUS) return { lineId: line.id, cp: "cp1" as const }
    const d2x = point.x - line.cp2.x; const d2y = point.y - line.cp2.y
    if (Math.sqrt(d2x * d2x + d2y * d2y) <= HIT_RADIUS) return { lineId: line.id, cp: "cp2" as const }
  }
  return null
}

const findEndpointAt = (lines: LineEditor[], point: Point) => {
  for (const line of lines) {
    const dsx = point.x - line.start.x
    const dsy = point.y - line.start.y
    if (Math.sqrt(dsx * dsx + dsy * dsy) <= HIT_RADIUS)
      return { lineId: line.id, endpoint: "start" as const }
    const dex = point.x - line.end.x
    const dey = point.y - line.end.y
    if (Math.sqrt(dex * dex + dey * dey) <= HIT_RADIUS)
      return { lineId: line.id, endpoint: "end" as const }
  }
  return null
}

export const LevelEditor = () => {
  const dpr = window.devicePixelRatio || 1
  const [leftWidth, setLeftWidth] = useState(() => Math.round(window.innerWidth * 0.3))
  const [scale, setScale] = useState(1)
  const [snapPoint, setSnapPoint] = useState<Point | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverNearEndpoint, setHoverNearEndpoint] = useState(false)
  const [showIds, setShowIds] = useState(true)
  const [addStartSnap, setAddStartSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)
  const [addSwitchSnap, setAddSwitchSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)
  const [addRotatorSnap, setAddRotatorSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)
  const [addPainterSnap, setAddPainterSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)
  const [addArrivalSnap, setAddArrivalSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)
  const [addFaderSnap, setAddFaderSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)
  const [addInverterSnap, setAddInverterSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)

  const leftRef = useRef<HTMLDivElement>(null)
  const canvasAreaRef = useRef<HTMLDivElement>(null)
  const editorCanvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const dragging = useRef(false)
  const draggingEndpoint = useRef<{ lineId: string; endpoint: "start" | "end" } | null>(null)
  const draggingCP = useRef<{ lineId: string; cp: "cp1" | "cp2" } | null>(null)

  const {
    editorManager, previewManager, revision, arrival,
    mode, viewMode, pendingPoint, starts, switches, rotators, painters, faders, inverters, hoveredLineId, hoveredSwitchId, hoveredRotatorId, hoveredPainterId, hoveredFaderId, hoveredInverterId, lineType,
    addLine, addStart, addSwitch, addRotator, addPainter, addFader, addInverter, setArrival, setPendingPoint, setMode, setViewMode, updateLineEndpoint, updateLineControlPoint, setHoveredLineId,
  } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      previewManager: s.previewManager,
      revision: s.revision,
      arrival: s.arrival,
      mode: s.mode,
      viewMode: s.viewMode,
      pendingPoint: s.pendingPoint,
      starts: s.starts,
      switches: s.switches,
      rotators: s.rotators,
      painters: s.painters,
      faders: s.faders,
      inverters: s.inverters,
      hoveredLineId: s.hoveredLineId,
      hoveredSwitchId: s.hoveredSwitchId,
      hoveredRotatorId: s.hoveredRotatorId,
      hoveredPainterId: s.hoveredPainterId,
      hoveredFaderId: s.hoveredFaderId,
      hoveredInverterId: s.hoveredInverterId,
      lineType: s.lineType,
      addLine: s.addLine,
      addStart: s.addStart,
      addSwitch: s.addSwitch,
      addRotator: s.addRotator,
      addPainter: s.addPainter,
      addFader: s.addFader,
      addInverter: s.addInverter,
      setArrival: s.setArrival,
      setPendingPoint: s.setPendingPoint,
      setMode: s.setMode,
      setViewMode: s.setViewMode,
      updateLineEndpoint: s.updateLineEndpoint,
      updateLineControlPoint: s.updateLineControlPoint,
      setHoveredLineId: s.setHoveredLineId,
    }))
  )

  const startsArray = Object.values(starts)
  const switchesArray = Object.values(switches)
  const rotatorsArray = Object.values(rotators).map((r) => new RotatorEditor(r.linkId, r.id))
  const paintersArray = Object.values(painters).map((p) => new PainterEditor(p.linkId, p.color, p.id))
  const fadersArray = Object.values(faders).map((f) => new FaderEditor(f.linkId, f.id))
  const invertersArray = Object.values(inverters).map((inv) => new InverterEditor(inv.linkId, inv.id))
  const arrivalEditor = arrival ? new ArrivalEditor(arrival.lineId, arrival.endpoint, arrival.id) : null

  useCanvasDraw(
    editorCanvasRef, editorManager, revision,
    hoveredLineId,
    mode === "addLine" ? snapPoint : null,
    pendingPoint,
    showIds,
    startsArray,
    switchesArray,
    mode === "addStart" ? (addStartSnap?.pt ?? null) : null,
    mode === "addSwitch" ? (addSwitchSnap?.pt ?? null) : null,
    dpr * scale,
    hoveredSwitchId,
    rotatorsArray,
    hoveredRotatorId,
    mode === "addRotator" ? (addRotatorSnap?.pt ?? null) : null,
    paintersArray,
    hoveredPainterId,
    mode === "addPainter" ? (addPainterSnap?.pt ?? null) : null,
    fadersArray,
    hoveredFaderId,
    mode === "addFader" ? (addFaderSnap?.pt ?? null) : null,
    invertersArray,
    hoveredInverterId,
    mode === "addInverter" ? (addInverterSnap?.pt ?? null) : null,
    arrivalEditor,
    mode === "addArrival" ? (addArrivalSnap?.pt ?? null) : null
  )
  useCanvasDrawPreview(previewCanvasRef, viewMode === "preview" ? previewManager : null, dpr * scale)

  useEffect(() => {
    const el = canvasAreaRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const s = Math.min(
        (width - PADDING * 2) / CANVAS_W,
        (height - PADDING * 2) / CANVAS_H
      )
      setScale(Math.max(0.1, s))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const onDividerMouseDown = useCallback(() => {
    dragging.current = true
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      setLeftWidth(Math.max(120, Math.min(e.clientX, window.innerWidth - 120)))
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }, [])

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (CANVAS_W / rect.width),
      y: (e.clientY - rect.top) * (CANVAS_H / rect.height),
    }
  }

  const onCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "select") return
    const point = getCanvasPoint(e)
    const lines = Object.values(editorManager.data.lines)
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
  }, [mode, editorManager])

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
    } else if (mode === "addRotator") {
      const hit = findEndpointAt(Object.values(editorManager.data.lines), raw)
      if (hit) {
        const line = editorManager.data.lines[hit.lineId]
        setAddRotatorSnap({ lineId: hit.lineId, endpoint: hit.endpoint, pt: line[hit.endpoint] })
        setHoverNearEndpoint(true)
      } else {
        setAddRotatorSnap(null)
        setHoverNearEndpoint(false)
      }
    } else if (mode === "addPainter") {
      const hit = findEndpointAt(Object.values(editorManager.data.lines), raw)
      if (hit) {
        const line = editorManager.data.lines[hit.lineId]
        setAddPainterSnap({ lineId: hit.lineId, endpoint: hit.endpoint, pt: line[hit.endpoint] })
        setHoverNearEndpoint(true)
      } else {
        setAddPainterSnap(null)
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
    } else if (mode === "addFader") {
      const hit = findEndpointAt(Object.values(editorManager.data.lines), raw)
      if (hit) {
        const line = editorManager.data.lines[hit.lineId]
        setAddFaderSnap({ lineId: hit.lineId, endpoint: hit.endpoint, pt: line[hit.endpoint] })
        setHoverNearEndpoint(true)
      } else {
        setAddFaderSnap(null)
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
  }, [mode, editorManager, updateLineEndpoint, setHoveredLineId])

  const onCanvasMouseUp = useCallback(() => {
    draggingEndpoint.current = null
    draggingCP.current = null
    setIsDragging(false)
  }, [])

  const onMouseLeave = useCallback(() => {
    setSnapPoint(null)
    setAddStartSnap(null)
    setAddSwitchSnap(null)
    setAddRotatorSnap(null)
    setAddPainterSnap(null)
    setAddArrivalSnap(null)
    setAddFaderSnap(null)
    setAddInverterSnap(null)
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
          addStart(new StartEditor(addStartSnap.lineId, addStartSnap.endpoint))
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
          addSwitch(new SwitchEditor(undefined, linkIds, linkIds[0] ?? null))
          setAddSwitchSnap(null)
          setMode("select")
        }
        return
      }
      if (mode === "addRotator") {
        if (addRotatorSnap) {
          const linkId = Object.values(editorManager.data.links).find((lk) =>
            (lk.line1.lineId === addRotatorSnap.lineId && lk.line1.endpoint === addRotatorSnap.endpoint) ||
            (lk.line2.lineId === addRotatorSnap.lineId && lk.line2.endpoint === addRotatorSnap.endpoint)
          )?.id
          if (linkId) {
            addRotator(linkId)
            setAddRotatorSnap(null)
            setMode("select")
          }
        }
        return
      }
      if (mode === "addPainter") {
        if (addPainterSnap) {
          const linkId = Object.values(editorManager.data.links).find((lk) =>
            (lk.line1.lineId === addPainterSnap.lineId && lk.line1.endpoint === addPainterSnap.endpoint) ||
            (lk.line2.lineId === addPainterSnap.lineId && lk.line2.endpoint === addPainterSnap.endpoint)
          )?.id
          if (linkId) {
            addPainter(linkId)
            setAddPainterSnap(null)
            setMode("select")
          }
        }
        return
      }
      if (mode === "addArrival") {
        if (addArrivalSnap) {
          setArrival(addArrivalSnap.lineId, addArrivalSnap.endpoint)
          setAddArrivalSnap(null)
          setMode("select")
        }
        return
      }
      if (mode === "addFader") {
        if (addFaderSnap) {
          const linkId = Object.values(editorManager.data.links).find((lk) =>
            (lk.line1.lineId === addFaderSnap.lineId && lk.line1.endpoint === addFaderSnap.endpoint) ||
            (lk.line2.lineId === addFaderSnap.lineId && lk.line2.endpoint === addFaderSnap.endpoint)
          )?.id
          if (linkId) {
            addFader(linkId)
            setAddFaderSnap(null)
            setMode("select")
          }
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
      if (mode !== "addLine") return
      const point = snapToGrid(getCanvasPoint(e))
      if (!pendingPoint) {
        setPendingPoint(point)
      } else {
        addLine(new LineEditor(pendingPoint, point, lineType))
        setPendingPoint(null)
        setMode("select")
      }
    },
    [mode, pendingPoint, addStartSnap, addSwitchSnap, addRotatorSnap, addPainterSnap, addArrivalSnap, addFaderSnap, addInverterSnap, lineType, addLine, addStart, addSwitch, addRotator, addPainter, addFader, addInverter, setArrival, setPendingPoint, setMode]
  )

  const canvasCursor = mode === "addLine"
    ? "none"
    : (mode === "addStart" || mode === "addSwitch" || mode === "addRotator" || mode === "addPainter" || mode === "addArrival" || mode === "addFader" || mode === "addInverter")
      ? (hoverNearEndpoint ? "pointer" : "crosshair")
      : isDragging
        ? "grabbing"
        : hoverNearEndpoint
          ? "grab"
          : "crosshair"

  return (
    <S.Container>
      <S.LeftPanel $width={leftWidth} ref={leftRef}>
        <S.TopBar>
          <S.ViewButton $active={viewMode === "editor"} onClick={() => setViewMode("editor")}>
            Editor
          </S.ViewButton>
          <S.ViewButton $active={viewMode === "preview"} onClick={() => setViewMode("preview")}>
            Preview
          </S.ViewButton>
        </S.TopBar>
        <S.CanvasArea ref={canvasAreaRef}>
          <S.CanvasOuter>
            <S.CanvasWrapper $w={CANVAS_W * scale} $h={CANVAS_H * scale}>
              <S.StyledCanvas
                ref={editorCanvasRef}
                width={CANVAS_W * dpr * scale}
                height={CANVAS_H * dpr * scale}
                $w={CANVAS_W}
                $h={CANVAS_H}
                $scale={scale}
                $cursor={canvasCursor}
                $visible={viewMode === "editor"}
                onMouseDown={onCanvasMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onCanvasMouseUp}
                onMouseLeave={onMouseLeave}
                onClick={onCanvasClick}
              />
              <S.StyledCanvas
                ref={previewCanvasRef}
                width={CANVAS_W * dpr * scale}
                height={CANVAS_H * dpr * scale}
                $w={CANVAS_W}
                $h={CANVAS_H}
                $scale={scale}
                $cursor={viewMode === "preview" && Object.keys(previewManager.data.switches).length > 0 ? "pointer" : "default"}
                $visible={viewMode === "preview"}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = (e.clientX - rect.left) * (CANVAS_W / rect.width)
                  const y = (e.clientY - rect.top) * (CANVAS_H / rect.height)
                  previewManager.cycleSwitchAt(x, y)
                }}
              />
            </S.CanvasWrapper>
            {viewMode === "editor" && (
              <S.IdsButton $active={showIds} onClick={() => setShowIds((v) => !v)}>
                IDs
              </S.IdsButton>
            )}
            {viewMode === "preview" && (
              <S.RestartButton onClick={() => setViewMode("preview")}>
                ↺ Restart
              </S.RestartButton>
            )}
          </S.CanvasOuter>
        </S.CanvasArea>
      </S.LeftPanel>
      <S.RightArea>
        <S.Divider onMouseDown={onDividerMouseDown} />
        <S.RightPanel>
          <ToolsPanel />
        </S.RightPanel>
        {viewMode === "preview" && <S.Overlay />}
      </S.RightArea>
    </S.Container>
  )
}
