import { useCallback, useEffect, useRef, useState } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { IoPause, IoPlay, IoRefresh, IoChevronForward, IoApps, IoStar } from "react-icons/io5"
import { useShallow } from "zustand/react/shallow"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import { useGameStore, loadMap } from "store"
import { getMapById, getNextMap, calcStars, formatTime } from "maps"
import { useLang } from "hooks/useLang"
import { useProgressStore } from "progressStore"
import { T } from "theme"
import { SvgPreviewCanvas } from "../../components/svg/preview/SvgPreviewCanvas"
import type { Props } from "./types"
import * as S from "./UI"

export const Jeu = ({ mapId, onBack, onRejouer, onSuivant, onCartes }: Props) => {
  const { previewManager, loading, helps } = useGameStore(
    useShallow((s) => ({ previewManager: s.previewManager, loading: s.loading, helps: s.helps }))
  )
  const recordResult = useProgressStore((s) => s.recordResult)
  const t = useLang()
  const [paused, setPaused] = useState(false)
  const [displayTime, setDisplayTime] = useState("00:00")
  const [winData, setWinData] = useState<{ time: number; stars: number; noCollision: boolean } | null>(null)
  const [helpVisible, setHelpVisible] = useState(true)
  const [helpDismissed, setHelpDismissed] = useState(false)
  const helpFadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
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
    setHelpVisible(true)
    setHelpDismissed(false)
    if (helpFadeTimer.current) clearTimeout(helpFadeTimer.current)
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
        setWinData({ time: wonAt.current, stars, noCollision })
      }
      return
    }

    const allSpawned = initialTokenCount.current !== null && data.tokens.length === 0
    if (!allSpawned || data.elapsedSeconds < 1) return
    gameOver.current = true
  }, [previewManager, paused, map, mapId, mapName, recordResult])

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!previewManager) return
      if (!helpDismissed && helpVisible) {
        setHelpVisible(false)
        helpFadeTimer.current = setTimeout(() => setHelpDismissed(true), 400)
      }
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (CANVAS_W / rect.width)
      const y = (e.clientY - rect.top) * (CANVAS_H / rect.height)
      previewManager.clickAt(x, y)
    },
    [previewManager, helpDismissed, helpVisible]
  )

  const prevBest = useProgressStore((s) => s.results[mapId]?.bestTime)
  const isNewRecord = winData ? !prevBest || winData.time < prevBest : false
  const accent = map ? (map.difficulty === "Tutoriel" ? T.green : map.difficulty === "AvancÃ©" ? T.blue : T.red) : T.green

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
            {!helpDismissed && !winData && (() => {
              const sid = previewManager.data.previewScreenId
              const screenHelps = helps.filter((h) => h.screenId === sid)
              return screenHelps.length > 0 ? (
                <S.HelpOverlay $visible={helpVisible}>
                  {screenHelps.map((h) => (
                    <S.HelpBox key={h.id} $x={(h.x / CANVAS_W) * 100} $y={(h.y / CANVAS_H) * 100} $arrow={h.arrow}>
                      {h.text}
                    </S.HelpBox>
                  ))}
                </S.HelpOverlay>
              ) : null
            })()}
            {paused && !winData && (
              <S.PauseOverlay>
                <S.PauseTitle>{t.jeu.pause}</S.PauseTitle>
                <S.PauseBtn2 onClick={() => setPaused(false)}>{t.jeu.resume}</S.PauseBtn2>
              </S.PauseOverlay>
            )}
            {winData && (
              <S.WinOverlay>
                <S.WinCard>
<S.WinHeading>{t.jeu.won} !</S.WinHeading>
                  <S.WinStars>
                    <S.WinStar $filled={winData.stars >= 1}><IoStar /></S.WinStar>
                    <S.WinStar $filled={winData.stars >= 2}><IoStar /></S.WinStar>
                    <S.WinStar $filled={winData.stars >= 3}><IoStar /></S.WinStar>
                  </S.WinStars>
                  <S.WinStatsBox>
                    <S.WinStatsLabel>{mapName}</S.WinStatsLabel>
                    <S.WinStatsTime $color={accent}>{formatTime(winData.time)}</S.WinStatsTime>
                  </S.WinStatsBox>
                  <S.WinRecord>
                    {isNewRecord ? t.victoire.newRecord : prevBest ? `${t.victoire.bestLabel} : ${formatTime(prevBest)}` : ""}
                  </S.WinRecord>
                  <S.WinButtons>
                    <S.WinBtnSecondary onClick={onRejouer}>
                      <S.WinBtnIcon><IoRefresh /></S.WinBtnIcon>
                      <S.WinBtnLabel>{t.victoire.rejouer}</S.WinBtnLabel>
                    </S.WinBtnSecondary>
                    {nextMap ? (
                      <S.WinBtnPrimary onClick={onSuivant}>
                        <S.WinBtnIcon $light><IoChevronForward /></S.WinBtnIcon>
                        <S.WinBtnLabel $light>{t.victoire.suivant}</S.WinBtnLabel>
                      </S.WinBtnPrimary>
                    ) : (
                      <S.WinBtnPrimary onClick={onCartes}>
                        <S.WinBtnIcon $light><IoApps /></S.WinBtnIcon>
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


