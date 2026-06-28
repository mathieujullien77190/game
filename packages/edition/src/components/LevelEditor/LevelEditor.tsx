import { useCallback, useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { CANVAS_H, CANVAS_W } from "engine/constants"
import { useStore } from "store"
import { serializeMap } from "engine/mapJson"
import { Edition } from "components/Edition"
import { Game } from "@tickwire/game"
import * as S from "./UI"
import ToolsPanel from "components/ToolsPanel"

export const LevelEditor = () => {
  const [leftWidth, setLeftWidth] = useState(() => Math.round(window.innerWidth * 0.3))

  const dragging = useRef(false)

  const { viewMode, setViewMode, previewManager, helps } = useStore(
    useShallow((s) => ({
      viewMode: s.viewMode,
      setViewMode: s.setViewMode,
      previewManager: s.previewManager,
      helps: s.helps,
    }))
  )

  const restartPreview = useCallback(() => setViewMode("preview"), [setViewMode])

  const saveMap = useCallback(async () => {
    const s = useStore.getState()
    const data = serializeMap(s.editorManager, s.tokens, s.starts, s.switches, s.switchLinks, s.transformers, s.arrival, s.inverters, s.screens, s.screenGates, s.screenTimeMultipliers, s.helps)
    await fetch("/api/save-map", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "default", data }),
    })
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

  return (
    <S.Container>
      <S.LeftPanel $width={leftWidth} >
        <S.TopBar>
          <S.ViewButton $active={viewMode === "editor"} onClick={() => setViewMode("editor")}>
            Editor
          </S.ViewButton>
          <S.ViewButton $active={viewMode === "preview"} onClick={() => setViewMode("preview")}>
            Preview
          </S.ViewButton>
          <S.SaveButton onClick={saveMap}>Save</S.SaveButton>
        </S.TopBar>
        <S.CanvasArea>
          <S.CanvasOuter>
            <S.CanvasWrapper $w={CANVAS_W} $h={CANVAS_H}>
              {viewMode === "editor" && <Edition />}
              {viewMode === "preview" && <Game previewManager={previewManager} onRestart={restartPreview} helps={Object.values(helps)} />}
            </S.CanvasWrapper>
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
