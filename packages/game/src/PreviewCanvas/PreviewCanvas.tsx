import { useRef } from "react"
import { CANVAS_W, CANVAS_H } from "@drift/engine/constants"
import type { PreviewManager } from "@drift/engine/Manager/PreviewManager"
import { useCanvasDrawPreview } from "../hooks/useCanvasDrawPreview"
import * as S from "./UI"

type Props = {
  previewManager: PreviewManager
  dpr: number
  scale: number
  paused: boolean
  visible: boolean
}

export const PreviewCanvas = ({ previewManager, dpr, scale, paused, visible }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useCanvasDrawPreview(canvasRef, visible ? previewManager : null, dpr * scale, paused)

  return (
    <S.StyledCanvas
      ref={canvasRef}
      width={CANVAS_W * dpr * scale}
      height={CANVAS_H * dpr * scale}
      $w={CANVAS_W}
      $h={CANVAS_H}
      $scale={scale}
      $cursor={visible && Object.keys(previewManager.data.switches).length > 0 ? "pointer" : "default"}
      $visible={visible}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (CANVAS_W / rect.width)
        const y = (e.clientY - rect.top) * (CANVAS_H / rect.height)
        previewManager.clickAt(x, y)
      }}
    />
  )
}
