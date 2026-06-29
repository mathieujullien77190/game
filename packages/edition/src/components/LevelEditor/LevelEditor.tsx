import { useCallback, useEffect, useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { CANVAS_H, CANVAS_W } from "engine/constants"
import { useStore } from "store"
import { Edition } from "components/Edition"
import { Game } from "@tickwire/game"
import * as S from "./UI"
import ToolsPanel from "components/ToolsPanel"

export const LevelEditor = () => {
  const [leftWidth, setLeftWidth] = useState(() => Math.round(window.innerWidth * 0.3))

  const initialized = useStore((s) => s.initialized)
  useEffect(() => { useStore.getState().init() }, [])

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

  if (!initialized) return <S.Container style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</S.Container>

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
