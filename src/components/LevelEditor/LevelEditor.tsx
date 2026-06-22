import { useCallback, useEffect, useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { LineEditor } from "engine/Line/LineEditor"
import { Start } from "engine/Start/Start"
import { GRID_SIZE } from "engine/constants"
import type { Point } from "engine/types"
import { useStore } from "store"
import { useCanvasDraw } from "hooks/useCanvasDraw"
import { useCanvasDrawPreview } from "hooks/useCanvasDrawPreview"
import * as S from "./UI"
import ToolsPanel from "components/ToolsPanel"

const CANVAS_W = 405
const CANVAS_H = 720
const PADDING = 24
const HIT_RADIUS = 10

const snapToGrid = (p: Point): Point => ({
  x: Math.round(p.x / GRID_SIZE) * GRID_SIZE,
  y: Math.round(p.y / GRID_SIZE) * GRID_SIZE,
})

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
  const [showIds, setShowIds] = useState(false)
  const [addStartSnap, setAddStartSnap] = useState<{ lineId: string; endpoint: "start" | "end"; pt: Point } | null>(null)

  const leftRef = useRef<HTMLDivElement>(null)
  const canvasAreaRef = useRef<HTMLDivElement>(null)
  const editorCanvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const dragging = useRef(false)
  const draggingEndpoint = useRef<{ lineId: string; endpoint: "start" | "end" } | null>(null)

  const {
    editorManager, previewManager, revision,
    mode, viewMode, pendingPoint, start,
    addLine, setPendingPoint, setMode, setViewMode, updateLineEndpoint, setStart,
  } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      previewManager: s.previewManager,
      revision: s.revision,
      mode: s.mode,
      viewMode: s.viewMode,
      pendingPoint: s.pendingPoint,
      start: s.start,
      addLine: s.addLine,
      setPendingPoint: s.setPendingPoint,
      setMode: s.setMode,
      setViewMode: s.setViewMode,
      updateLineEndpoint: s.updateLineEndpoint,
      setStart: s.setStart,
    }))
  )

  useCanvasDraw(
    editorCanvasRef, editorManager, revision,
    null,
    mode === "addLine" ? snapPoint : null,
    pendingPoint,
    showIds,
    start,
    mode === "addStart" ? (addStartSnap?.pt ?? null) : null
  )
  useCanvasDrawPreview(previewCanvasRef, viewMode === "preview" ? previewManager : null)

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
    const hit = findEndpointAt(Object.values(editorManager.data.lines),point)
    if (hit) {
      draggingEndpoint.current = hit
      setIsDragging(true)
    }
  }, [mode, editorManager])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const raw = getCanvasPoint(e)
    const point = snapToGrid(raw)
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
    } else {
      setSnapPoint(point)
      if (mode === "select") {
        setHoverNearEndpoint(findEndpointAt(Object.values(editorManager.data.lines), raw) !== null)
      }
    }
  }, [mode, editorManager, updateLineEndpoint])

  const onCanvasMouseUp = useCallback(() => {
    draggingEndpoint.current = null
    setIsDragging(false)
  }, [])

  const onMouseLeave = useCallback(() => {
    setSnapPoint(null)
    setAddStartSnap(null)
    setHoverNearEndpoint(false)
    draggingEndpoint.current = null
    setIsDragging(false)
  }, [])

  const onCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mode === "addStart") {
        if (addStartSnap) {
          setStart(new Start(addStartSnap.lineId, addStartSnap.endpoint, start?.delay ?? 0))
          setAddStartSnap(null)
          setMode("select")
        }
        return
      }
      if (mode !== "addLine") return
      const point = snapToGrid(getCanvasPoint(e))
      if (!pendingPoint) {
        setPendingPoint(point)
      } else {
        addLine(new LineEditor(pendingPoint, point))
        setPendingPoint(null)
        setMode("select")
      }
    },
    [mode, pendingPoint, addStartSnap, start, addLine, setPendingPoint, setMode, setStart]
  )

  const canvasCursor = mode === "addLine"
    ? "none"
    : mode === "addStart"
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
                width={CANVAS_W}
                height={CANVAS_H}
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
                width={CANVAS_W}
                height={CANVAS_H}
                $scale={scale}
                $cursor="default"
                $visible={viewMode === "preview"}
              />
            </S.CanvasWrapper>
            {viewMode === "editor" && (
              <S.IdsButton $active={showIds} onClick={() => setShowIds((v) => !v)}>
                IDs
              </S.IdsButton>
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
