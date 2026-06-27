import { useCallback, useEffect, useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { LineEditor } from "engine/Line/LineEditor"
import { StartEditor } from "engine/Start/StartEditor"
import { SwitchEditor } from "engine/Switch/SwitchEditor"
import { TransformerEditor } from "engine/Transformer/TransformerEditor"
import { InverterEditor } from "engine/Inverter/InverterEditor"
import { ArrivalEditor } from "engine/Arrival/ArrivalEditor"
import { ScreenGateEditor } from "engine/ScreenGate/ScreenGateEditor"
import { CANVAS_H, CANVAS_W, GRID_SIZE } from "engine/constants"
import type { Point } from "engine/types"
import { useStore } from "store"
import { SvgEditorCanvas } from "components/svg/editor/SvgEditorCanvas"
import { SvgPreviewCanvas } from "components/svg/preview/SvgPreviewCanvas"
import * as S from "./UI"
import ToolsPanel from "components/ToolsPanel"

const PADDING = 24
const HIT_RADIUS = 10

const snapToGrid = (p: Point): Point => ({
  x: Math.round(p.x / GRID_SIZE) * GRID_SIZE,
  y: Math.round(p.y / GRID_SIZE) * GRID_SIZE,
})

const findElbowFlipAt = (lines: LineEditor[], point: Point) => {
  for (const line of lines) {
    if (line.type !== "elbow") continue
    const corner = line.flip ? { x: line.end.x, y: line.start.y } : { x: line.start.x, y: line.end.y }
    const dx = point.x - corner.x, dy = point.y - corner.y
    if (Math.sqrt(dx * dx + dy * dy) <= HIT_RADIUS) return line.id
  }
  return null
}

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
  const [leftWidth, setLeftWidth] = useState(() => Math.round(window.innerWidth * 0.3))
  const [scale, setScale] = useState(1)
  const [snapPoint, setSnapPoint] = useState<Point | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverNearEndpoint, setHoverNearEndpoint] = useState(false)
  const [showIds, setShowIds] = useState(true)
  const [paused, setPaused] = useState(false)
  const [addStartSnap, setAddStartSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)
  const [addSwitchSnap, setAddSwitchSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)
  const [addTransformerSnap, setAddTransformerSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)
  const [addArrivalSnap, setAddArrivalSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)
  const [addInverterSnap, setAddInverterSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)
  const [addScreenGateSnap, setAddScreenGateSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)

  const leftRef = useRef<HTMLDivElement>(null)
  const canvasAreaRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const draggingEndpoint = useRef<{ lineId: string; endpoint: "start" | "end" } | null>(null)
  const draggingCP = useRef<{ lineId: string; cp: "cp1" | "cp2" } | null>(null)

  const {
    editorManager, previewManager, revision, arrival,
    mode, viewMode, pendingPoint, pendingTransformerType,
    starts, switches, transformers, inverters, screenGates,
    hoveredLineId, hoveredSwitchId, hoveredTransformerId, hoveredInverterId, hoveredScreenGateId,
    lineType, linePreset, screens, currentScreenId,
    addLine, addStart, addSwitch, addTransformer, addInverter, setArrival, addScreenGate,
    setPendingPoint, setMode, setViewMode, updateLineEndpoint, updateLineControlPoint, toggleLineFlip, setHoveredLineId, setLinePreset,
    addScreen, setCurrentScreen, removeScreen,
  } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      previewManager: s.previewManager,
      revision: s.revision,
      arrival: s.arrival,
      mode: s.mode,
      viewMode: s.viewMode,
      pendingPoint: s.pendingPoint,
      pendingTransformerType: s.pendingTransformerType,
      starts: s.starts,
      switches: s.switches,
      transformers: s.transformers,
      inverters: s.inverters,
      screenGates: s.screenGates,
      hoveredLineId: s.hoveredLineId,
      hoveredSwitchId: s.hoveredSwitchId,
      hoveredTransformerId: s.hoveredTransformerId,
      hoveredInverterId: s.hoveredInverterId,
      hoveredScreenGateId: s.hoveredScreenGateId,
      lineType: s.lineType,
      linePreset: s.linePreset,
      screens: s.screens,
      currentScreenId: s.currentScreenId,
      addLine: s.addLine,
      addStart: s.addStart,
      addSwitch: s.addSwitch,
      addTransformer: s.addTransformer,
      addInverter: s.addInverter,
      addScreenGate: s.addScreenGate,
      setArrival: s.setArrival,
      setPendingPoint: s.setPendingPoint,
      setMode: s.setMode,
      setViewMode: s.setViewMode,
      updateLineEndpoint: s.updateLineEndpoint,
      updateLineControlPoint: s.updateLineControlPoint,
      toggleLineFlip: s.toggleLineFlip,
      setHoveredLineId: s.setHoveredLineId,
      setLinePreset: s.setLinePreset,
      addScreen: s.addScreen,
      setCurrentScreen: s.setCurrentScreen,
      removeScreen: s.removeScreen,
    }))
  )

  const visibleLineIds = new Set(
    Object.values(editorManager.data.lines)
      .filter((l) => l.screenId === currentScreenId)
      .map((l) => l.id)
  )
  const startsArray = Object.values(starts).filter((s) => s.screenId === currentScreenId)
  const switchesArray = Object.values(switches).filter((sw) => sw.screenId === currentScreenId)
  const transformersArray = Object.values(transformers)
    .filter((tr) => tr.screenId === currentScreenId)
    .map((tr) => new TransformerEditor(tr.linkId, tr.type, tr.id, tr.amount, tr.color, tr.targetType))
  const invertersArray = Object.values(inverters)
    .filter((inv) => inv.screenId === currentScreenId)
    .map((inv) => new InverterEditor(inv.linkId, inv.id))
  const arrivalEditor = arrival && arrival.screenId === currentScreenId
    ? new ArrivalEditor(arrival.lineId, arrival.endpoint, arrival.id)
    : null
  const screenGatesArray = Object.values(screenGates)
    .filter((sg) => sg.screenId === currentScreenId)
    .map((sg) => new ScreenGateEditor(sg.linkId, sg.id, sg.screenId, sg.targetScreenId, sg.entryKey, sg.exitKey))
  const screenGateMarkersArray = Object.values(screenGates)
    .filter((sg) => sg.targetScreenId === currentScreenId)
    .map((sg) => ({ entryKey: sg.entryKey, exitKey: sg.exitKey }))


  useEffect(() => {
    const el = canvasAreaRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const raw = Math.min(
        (width - PADDING * 2) / CANVAS_W,
        (height - PADDING * 2) / CANVAS_H
      )
      setScale(Math.max(0.1, raw))
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

  const getCanvasPoint = (e: React.MouseEvent<SVGSVGElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (CANVAS_W / rect.width),
      y: (e.clientY - rect.top) * (CANVAS_H / rect.height),
    }
  }

  const onCanvasMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
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

  const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
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
    (e: React.MouseEvent<SVGSVGElement>) => {
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
          setArrival(addArrivalSnap.lineId, addArrivalSnap.endpoint)
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
    [mode, pendingPoint, pendingTransformerType, addStartSnap, addSwitchSnap, addTransformerSnap, addArrivalSnap, addInverterSnap, addScreenGateSnap, lineType, linePreset, addLine, addStart, addSwitch, addTransformer, addInverter, addScreenGate, setArrival, setPendingPoint, setMode, setLinePreset, toggleLineFlip, editorManager, currentScreenId]
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
              <SvgEditorCanvas
                editorManager={editorManager}
                hoveredLineId={hoveredLineId}
                snapPoint={mode === "addLine" ? snapPoint : null}
                pendingPoint={pendingPoint}
                showIds={showIds}
                starts={startsArray}
                switches={switchesArray}
                previewStartPt={mode === "addStart" ? (addStartSnap?.pt ?? null) : null}
                previewSwitchPt={mode === "addSwitch" ? (addSwitchSnap?.pt ?? null) : null}
                hoveredSwitchId={hoveredSwitchId}
                transformers={transformersArray}
                hoveredTransformerId={hoveredTransformerId}
                previewTransformerPt={mode === "addTransformer" ? (addTransformerSnap?.pt ?? null) : null}
                previewTransformerType={mode === "addTransformer" ? pendingTransformerType : null}
                inverters={invertersArray}
                hoveredInverterId={hoveredInverterId}
                previewInverterPt={mode === "addInverter" ? (addInverterSnap?.pt ?? null) : null}
                arrival={arrivalEditor}
                previewArrivalPt={mode === "addArrival" ? (addArrivalSnap?.pt ?? null) : null}
                screenGates={screenGatesArray}
                hoveredScreenGateId={hoveredScreenGateId}
                previewScreenGatePt={mode === "addScreenGate" ? (addScreenGateSnap?.pt ?? null) : null}
                screenGateMarkers={screenGateMarkersArray}
                visibleLineIds={visibleLineIds}
                cursor={canvasCursor}
                visible={viewMode === "editor"}
                onMouseDown={onCanvasMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onCanvasMouseUp}
                onMouseLeave={onMouseLeave}
                onClick={onCanvasClick}
              />
              <SvgPreviewCanvas
                manager={viewMode === "preview" ? previewManager : null}
                paused={paused}
                visible={viewMode === "preview"}
                cursor={Object.keys(previewManager.data.switches).length > 0 ? "pointer" : "default"}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = (e.clientX - rect.left) * (CANVAS_W / rect.width)
                  const y = (e.clientY - rect.top) * (CANVAS_H / rect.height)
                  previewManager.clickAt(x, y)
                }}
              />
            </S.CanvasWrapper>
            {viewMode === "editor" && (
              <>
                <S.ScreenBar>
                  {screens.map((s) => (
                    <S.ScreenBtn key={s} $active={currentScreenId === s} onClick={() => setCurrentScreen(s)}>
                      {s === "main" ? "main" : s.replace("screen", "")}
                      {s !== "main" && (
                        <S.ScreenClose onClick={(e) => { e.stopPropagation(); removeScreen(s) }}>×</S.ScreenClose>
                      )}
                    </S.ScreenBtn>
                  ))}
                  <S.ScreenBtn $active={false} onClick={addScreen}>+</S.ScreenBtn>
                </S.ScreenBar>
                <S.IdsButton $active={showIds} onClick={() => setShowIds((v) => !v)}>
                  IDs
                </S.IdsButton>
              </>
            )}
            {viewMode === "preview" && (
              <>
                <S.RestartButton onClick={() => { setPaused(false); setViewMode("preview") }}>
                  ↺ Restart
                </S.RestartButton>
                <S.PauseButton $active={paused} onClick={() => setPaused((v) => !v)}>
                  {paused ? "▶" : "⏸"}
                </S.PauseButton>
              </>
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
