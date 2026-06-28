import { useState } from "react"
import { IoPause, IoPlay } from "react-icons/io5"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import type { PreviewManager } from "engine/Manager/PreviewManager"
import { SvgPreviewCanvas } from "../svg/preview/SvgPreviewCanvas"
import * as S from "./UI"

type Props = {
  previewManager: PreviewManager
  onRestart?: () => void
}

export const Game = ({ previewManager, onRestart }: Props) => {
  const [paused, setPaused] = useState(false)

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
      <S.PauseButton $active={paused} onClick={() => setPaused((v) => !v)}>
        {paused ? <IoPlay /> : <IoPause />}
      </S.PauseButton>
      {onRestart && <S.RestartButton onClick={onRestart}>↺</S.RestartButton>}
    </>
  )
}
