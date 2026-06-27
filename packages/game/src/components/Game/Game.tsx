import { useState } from "react"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import type { PreviewManager } from "engine/Manager/PreviewManager"
import { SvgPreviewCanvas } from "../svg/preview/SvgPreviewCanvas"
import * as S from "./UI"

type Props = {
  previewManager: PreviewManager
}

export const Game = ({ previewManager }: Props) => {
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)

  if (!playing) {
    return (
      <S.Lobby>
        <S.PlayButton onClick={() => setPlaying(true)}>Jouer</S.PlayButton>
      </S.Lobby>
    )
  }

  return (
    <>
      <SvgPreviewCanvas
        manager={previewManager}
        paused={paused}
        visible={true}
        cursor={Object.keys(previewManager.data.switches).length > 0 ? "pointer" : "default"}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = (e.clientX - rect.left) * (CANVAS_W / rect.width)
          const y = (e.clientY - rect.top) * (CANVAS_H / rect.height)
          previewManager.clickAt(x, y)
        }}
      />
      <S.RestartButton onClick={() => { setPaused(false); setPlaying(false) }}>
        ↺ Restart
      </S.RestartButton>
      <S.PauseButton $active={paused} onClick={() => setPaused((v) => !v)}>
        {paused ? "▶" : "⏸"}
      </S.PauseButton>
    </>
  )
}
