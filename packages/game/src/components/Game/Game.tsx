import { useEffect, useRef, useState } from "react"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import type { PreviewManager } from "engine/Manager/PreviewManager"
import type { Help } from "engine/Help/Help"
import { SvgPreviewCanvas } from "../svg/preview/SvgPreviewCanvas"
import * as S from "./UI"

type Props = {
  previewManager: PreviewManager
  onRestart?: () => void
  helps?: Help[]
}

export const Game = ({ previewManager, onRestart, helps = [] }: Props) => {
  const [paused, setPaused] = useState(false)
  const [helpVisible, setHelpVisible] = useState(true)
  const [helpDismissed, setHelpDismissed] = useState(false)
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sid = previewManager.data.previewScreenId
  const screenHelps = helps.filter((h) => h.screenId === sid)

  const dismissHelp = () => {
    if (helpDismissed || !helpVisible) return
    setHelpVisible(false)
    fadeTimer.current = setTimeout(() => setHelpDismissed(true), 400)
  }

  useEffect(() => () => { if (fadeTimer.current) clearTimeout(fadeTimer.current) }, [])

  return (
    <>
      <SvgPreviewCanvas
        manager={previewManager}
        paused={paused}
        visible={true}
        cursor={Object.keys(previewManager.data.switches).length > 0 ? "pointer" : "default"}
        onClick={(e: any) => {
          dismissHelp()
          const rect = e.currentTarget?.getBoundingClientRect()
          if (!rect) return
          // uniform scale + centering offset (xMidYMid meet letterboxing)
          const scale = Math.min(rect.width / CANVAS_W, rect.height / CANVAS_H) || 1
          const offsetX = (rect.width - CANVAS_W * scale) / 2
          const offsetY = (rect.height - CANVAS_H * scale) / 2
          const x = (e.clientX - rect.left - offsetX) / scale
          const y = (e.clientY - rect.top - offsetY) / scale
          previewManager.clickAt(x, y)
        }}
      />
      {!helpDismissed && screenHelps.length > 0 && (
        <S.HelpOverlay $visible={helpVisible}>
          {screenHelps.map((h) => (
            <S.HelpBox key={h.id} $x={(h.x / CANVAS_W) * 100} $y={(h.y / CANVAS_H) * 100} $arrow={h.arrow}>
              {h.text}
            </S.HelpBox>
          ))}
        </S.HelpOverlay>
      )}
      <S.PauseButton $active={paused} onClick={() => setPaused((v) => !v)}>
        {paused ? "▶" : "⏸"}
      </S.PauseButton>
      {onRestart && <S.RestartButton onClick={onRestart}>↺</S.RestartButton>}
    </>
  )
}
