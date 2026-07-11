import { useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { TransformerEditor } from "@drift/engine/entities/Transformer/TransformerEditor"
import { InverterEditor } from "@drift/engine/entities/Inverter/InverterEditor"
import { ArrivalEditor } from "@drift/engine/entities/Arrival/ArrivalEditor"
import { ScreenGateEditor } from "@drift/engine/entities/ScreenGate/ScreenGateEditor"
import { CANVAS_H, CANVAS_W } from "@drift/engine/constants"
import { useStore } from "store"
import { useCanvasDraw } from "hooks/useCanvasDraw"
import { useCanvasScale } from "hooks/useCanvasScale"
import { usePanelResize } from "hooks/usePanelResize"
import { useEditorInteraction } from "hooks/useEditorInteraction"
import { PreviewCanvas } from "components/PreviewCanvas"
import * as S from "./UI"
import ToolsPanel from "components/ToolsPanel"

export const LevelEditor = () => {
  const dpr = window.devicePixelRatio || 1
  const { width: leftWidth, onDividerMouseDown } = usePanelResize(Math.round(window.innerWidth * 0.3))
  const [showIds, setShowIds] = useState(true)
  const [paused, setPaused] = useState(false)

  const canvasAreaRef = useRef<HTMLDivElement>(null)
  const editorCanvasRef = useRef<HTMLCanvasElement>(null)
  const scale = useCanvasScale(canvasAreaRef, dpr)

  const {
    editorManager, previewManager, revision, arrivals,
    mode, viewMode, pendingPoint, pendingTransformerType,
    starts, switches, transformers, inverters, screenGates,
    hoveredLineId, hoveredSwitchId, hoveredTransformerId, hoveredInverterId, hoveredScreenGateId,
    lineType, linePreset, screens, currentScreenId,
    addLine, addStart, addSwitch, addTransformer, addInverter, addArrival, addScreenGate,
    setPendingPoint, setMode, setViewMode, updateLineEndpoint, updateLineControlPoint, toggleLineFlip, setHoveredLineId, setLinePreset,
    addScreen, setCurrentScreen, removeScreen,
  } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      previewManager: s.previewManager,
      revision: s.revision,
      arrivals: s.arrivals,
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
      addArrival: s.addArrival,
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

  const {
    snapPoint,
    addStartSnap, addSwitchSnap, addTransformerSnap, addArrivalSnap, addInverterSnap, addScreenGateSnap,
    onCanvasMouseDown, onMouseMove, onCanvasMouseUp, onMouseLeave, onCanvasClick,
    canvasCursor,
  } = useEditorInteraction({
    mode, editorManager, currentScreenId, pendingPoint, pendingTransformerType, lineType, linePreset,
    addLine, addStart, addSwitch, addTransformer, addArrival, addInverter, addScreenGate,
    setPendingPoint, setMode, setLinePreset, toggleLineFlip, updateLineEndpoint, updateLineControlPoint, setHoveredLineId,
  })

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
  const arrivalsArray = Object.values(arrivals)
    .filter((a) => a.screenId === currentScreenId)
    .map((a) => new ArrivalEditor(a.lineId, a.endpoint, a.id))
  const screenGatesArray = Object.values(screenGates)
    .filter((sg) => sg.screenId === currentScreenId)
    .map((sg) => new ScreenGateEditor(sg.linkId, sg.id, sg.screenId, sg.targetScreenId, sg.entryKey, sg.exitKey))
  const screenGateMarkersArray = Object.values(screenGates)
    .filter((sg) => sg.targetScreenId === currentScreenId)
    .map((sg) => ({ entryKey: sg.entryKey, exitKey: sg.exitKey }))

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
    transformersArray,
    hoveredTransformerId,
    mode === "addTransformer" ? (addTransformerSnap?.pt ?? null) : null,
    mode === "addTransformer" ? pendingTransformerType : null,
    invertersArray,
    hoveredInverterId,
    mode === "addInverter" ? (addInverterSnap?.pt ?? null) : null,
    arrivalsArray,
    mode === "addArrival" ? (addArrivalSnap?.pt ?? null) : null,
    screenGatesArray,
    hoveredScreenGateId,
    mode === "addScreenGate" ? (addScreenGateSnap?.pt ?? null) : null,
    screenGateMarkersArray,
    visibleLineIds,
  )

  return (
    <S.Container>
      <S.LeftPanel $width={leftWidth}>
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
              <PreviewCanvas
                previewManager={previewManager}
                dpr={dpr}
                scale={scale}
                paused={paused}
                visible={viewMode === "preview"}
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
