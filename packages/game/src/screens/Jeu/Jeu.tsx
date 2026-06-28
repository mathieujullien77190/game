import { useCallback, useEffect, useRef, useState } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { IoPause, IoPlay } from "react-icons/io5"
import { useShallow } from "zustand/react/shallow"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import { useGameStore, loadMap } from "store"
import { getMapById, calcStars, formatTime } from "maps"
import { useLang } from "hooks/useLang"
import { SvgPreviewCanvas } from "../../components/svg/preview/SvgPreviewCanvas"
import type { Props } from "./types"
import * as S from "./UI"

export const Jeu = ({ mapId, onBack, onWin }: Props) => {
  const { previewManager, loading } = useGameStore(
    useShallow((s) => ({ previewManager: s.previewManager, loading: s.loading }))
  )
  const t = useLang()
  const [paused, setPaused] = useState(false)
  const [displayTime, setDisplayTime] = useState("00:00")
  const gameOver = useRef(false)
  const hadCollision = useRef(false)
  const initialTokenCount = useRef<number | null>(null)

  const map = getMapById(mapId)
  const mapName = map
    ? `${t.cartes.cardPrefix} ${String(map.num).padStart(2, "0")}`
    : t.jeu.defaultMap

  useEffect(() => {
    gameOver.current = false
    hadCollision.current = false
    initialTokenCount.current = null
    setPaused(false)
    if (map) loadMap(map.file)
  }, [mapId])

  const handleTick = useCallback(() => {
    if (!previewManager || gameOver.current || paused) return
    const { data } = previewManager

    setDisplayTime(formatTime(data.elapsedSeconds))

    if (data.tokens.some((tok) => tok.exploding)) hadCollision.current = true

    if (initialTokenCount.current === null && data.tokens.length > 0) {
      initialTokenCount.current = data.tokens.length
    }

    const allSpawned = initialTokenCount.current !== null && data.tokens.length === 0
    if (!allSpawned || data.elapsedSeconds < 1) return

    const won =
      data.arrival !== null &&
      data.arrival.demands.length > 0 &&
      data.arrival.currentDemandIndex >= data.arrival.demands.length

    gameOver.current = true
    const stars = won && map ? calcStars(data.elapsedSeconds, map.starThresholds) : 1
    onWin(data.elapsedSeconds, won ? stars : 0, !hadCollision.current)
  }, [previewManager, paused, map, onWin])

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!previewManager) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (CANVAS_W / rect.width)
      const y = (e.clientY - rect.top) * (CANVAS_H / rect.height)
      previewManager.clickAt(x, y)
    },
    [previewManager]
  )

  return (
    <S.Screen>
      <S.Header>
        <S.BackBtn onClick={onBack}>
          <IoIosArrowBack size={22} />
        </S.BackBtn>
        <S.MapName>{mapName}</S.MapName>
        <S.PauseBtn onClick={() => setPaused((v) => !v)}>{paused ? <IoPlay /> : <IoPause />}</S.PauseBtn>
        <S.Timer>{displayTime}</S.Timer>
      </S.Header>

      <S.CanvasArea>
        {loading || !previewManager ? (
          <S.LoadingWrap>{t.jeu.loading}</S.LoadingWrap>
        ) : (
          <>
            <SvgPreviewCanvas
              manager={previewManager}
              paused={paused}
              visible={true}
              cursor={Object.keys(previewManager.data.switches).length > 0 ? "pointer" : "default"}
              onClick={handleClick}
              onTick={handleTick}
            />
            {paused && (
              <S.PauseOverlay>
                <S.PauseTitle>{t.jeu.pause}</S.PauseTitle>
                <S.PauseBtn2 onClick={() => setPaused(false)}>{t.jeu.resume}</S.PauseBtn2>
              </S.PauseOverlay>
            )}
          </>
        )}
      </S.CanvasArea>
    </S.Screen>
  )
}
