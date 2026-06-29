import { useCallback, useEffect, useRef, useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useShallow } from "zustand/react/shallow"
import { useGameStore, loadMap } from "store"
import { getMapById, getNextMap, calcStars, formatTime } from "maps"
import { useLang } from "hooks/useLang"
import { useProgressStore } from "progressStore"
import { T } from "theme"
import { SvgPreviewCanvas } from "../../components/svg/preview/SvgPreviewCanvas"
import type { Props } from "./types"
import * as S from "./UI"

export const Jeu = ({ mapId, onBack, onRejouer, onSuivant, onCartes }: Props) => {
  const { previewManager, loading } = useGameStore(
    useShallow((s) => ({ previewManager: s.previewManager, loading: s.loading }))
  )
  const recordResult = useProgressStore((s) => s.recordResult)
  const t = useLang()
  const [paused, setPaused] = useState(false)
  const [displayTime, setDisplayTime] = useState("00:00")
  const [winData, setWinData] = useState<{ time: number; stars: number } | null>(null)
  const gameOver = useRef(false)
  const hadCollision = useRef(false)
  const initialTokenCount = useRef<number | null>(null)
  const wonAt = useRef<number | null>(null)
  const saved = useRef(false)

  const map = getMapById(mapId)
  const nextMap = getNextMap(mapId)
  const mapName = map
    ? `${t.cartes.cardPrefix} ${String(map.num).padStart(2, "0")}`
    : t.jeu.defaultMap

  useEffect(() => {
    gameOver.current = false
    hadCollision.current = false
    initialTokenCount.current = null
    wonAt.current = null
    saved.current = false
    setPaused(false)
    setWinData(null)
    loadMap(map ? map.file : `${mapId}.json`)
  }, [mapId])

  const handleTick = useCallback(() => {
    if (!previewManager || gameOver.current || paused) return
    const { data } = previewManager

    setDisplayTime(formatTime(data.elapsedSeconds))

    if (data.tokens.some((tok) => tok.exploding)) hadCollision.current = true

    if (initialTokenCount.current === null && data.tokens.length > 0) {
      initialTokenCount.current = data.tokens.length
    }

    const n = data.arrival?.demands.length ?? 0
    const won = n > 0 && (data.arrival?.correctCount ?? 0) >= n

    if (won) {
      if (wonAt.current === null) wonAt.current = data.elapsedSeconds
      if (data.elapsedSeconds - wonAt.current >= 1 && !saved.current) {
        gameOver.current = true
        saved.current = true
        const stars = map ? calcStars(wonAt.current, map.starThresholds) : 1
        const noCollision = !hadCollision.current
        recordResult({ mapId, mapName, time: wonAt.current, stars, noCollision, won: true })
        setWinData({ time: wonAt.current, stars })
      }
      return
    }

    const allSpawned = initialTokenCount.current !== null && data.tokens.length === 0
    if (!allSpawned || data.elapsedSeconds < 1) return
    gameOver.current = true
  }, [previewManager, paused, map, mapId, mapName, recordResult])

  const handleClick = useCallback(
    (x: number, y: number) => {
      if (!previewManager) return
      previewManager.clickAt(x, y)
    },
    [previewManager]
  )

  const prevBest = useProgressStore((s) => s.results[mapId]?.bestTime)
  const isNewRecord = winData ? !prevBest || winData.time < prevBest : false
  const accent = map ? (map.difficulty === "Tutorial" ? T.green : map.difficulty === "Advanced" ? T.blue : T.red) : T.green
  const starColor = (n: number) => (winData && winData.stars >= n ? T.gold : T.border)

  return (
    <S.Screen>
      <S.Header>
        <S.BackBtn onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={T.muted} />
        </S.BackBtn>
        <S.MapName>{mapName}</S.MapName>
        <S.PauseBtn onPress={() => setPaused((v) => !v)} activeOpacity={0.8}>
          <Ionicons name={paused ? "play" : "pause"} size={16} color={T.navy} />
        </S.PauseBtn>
        <S.Timer>{displayTime}</S.Timer>
      </S.Header>

      <S.CanvasArea>
        {loading || !previewManager ? (
          <S.LoadingWrap>
            <S.LoadingText>{t.jeu.loading}</S.LoadingText>
          </S.LoadingWrap>
        ) : (
          <>
            <SvgPreviewCanvas
              manager={previewManager}
              paused={paused}
              visible={true}
              onClick={handleClick}
              onTick={handleTick}
            />
            {paused && !winData && (
              <S.PauseOverlay pointerEvents="box-none">
                <S.PauseTitle>{t.jeu.pause}</S.PauseTitle>
                <S.PauseBtn2 onPress={() => setPaused(false)} activeOpacity={0.85}>
                  <S.PauseBtn2Text>{t.jeu.resume}</S.PauseBtn2Text>
                </S.PauseBtn2>
              </S.PauseOverlay>
            )}
            {winData && (
              <S.WinOverlay pointerEvents="box-none">
                <S.WinCard>
                  <S.WinHeading>{t.jeu.won} !</S.WinHeading>
                  <S.WinStars>
                    <Ionicons name="star" size={48} color={starColor(1)} />
                    <Ionicons name="star" size={48} color={starColor(2)} />
                    <Ionicons name="star" size={48} color={starColor(3)} />
                  </S.WinStars>
                  <S.WinStatsBox>
                    <S.WinStatsLabel>{mapName}</S.WinStatsLabel>
                    <S.WinStatsTime $color={accent}>{formatTime(winData.time)}</S.WinStatsTime>
                  </S.WinStatsBox>
                  <S.WinRecord>
                    {isNewRecord ? t.victoire.newRecord : prevBest ? `${t.victoire.bestLabel} : ${formatTime(prevBest)}` : ""}
                  </S.WinRecord>
                  <S.WinButtons>
                    <S.WinBtnSecondary onPress={onRejouer} activeOpacity={0.7}>
                      <Ionicons name="refresh" size={18} color={T.navy} />
                      <S.WinBtnLabel>{t.victoire.rejouer}</S.WinBtnLabel>
                    </S.WinBtnSecondary>
                    {nextMap ? (
                      <S.WinBtnPrimary onPress={onSuivant} activeOpacity={0.85}>
                        <Ionicons name="chevron-forward" size={18} color="#fff" />
                        <S.WinBtnLabel $light>{t.victoire.suivant}</S.WinBtnLabel>
                      </S.WinBtnPrimary>
                    ) : (
                      <S.WinBtnPrimary onPress={onCartes} activeOpacity={0.85}>
                        <Ionicons name="apps" size={18} color="#fff" />
                        <S.WinBtnLabel $light>{t.victoire.cartes}</S.WinBtnLabel>
                      </S.WinBtnPrimary>
                    )}
                  </S.WinButtons>
                </S.WinCard>
              </S.WinOverlay>
            )}
          </>
        )}
      </S.CanvasArea>
    </S.Screen>
  )
}
