import { useEffect, useRef, useState } from "react"
import { IoRefresh, IoChevronForward, IoApps, IoStar, IoSparkles } from "react-icons/io5"
import { useShallow } from "zustand/react/shallow"
import { useProgressStore, ACHIEVEMENTS } from "progressStore"
import { getMapById, getNextMap, formatTime } from "maps"
import { useLang } from "hooks/useLang"
import { T } from "theme"
import type { Props } from "./types"
import { DIFF_COLOR } from "./constants"
import * as S from "./UI"

export const Victoire = ({
  mapId,
  time,
  stars,
  noCollision,
  onRejouer,
  onSuivant,
  onCartes,
}: Props) => {
  const t = useLang()
  const { results, recordResult, achievements } = useProgressStore(
    useShallow((s) => ({
      results: s.results,
      recordResult: s.recordResult,
      achievements: s.achievements,
    }))
  )
  const map = getMapById(mapId)
  const nextMap = getNextMap(mapId)
  const prevBest = results[mapId]?.bestTime
  const isNewRecord = stars > 0 && (!prevBest || time < prevBest)
  const saved = useRef(false)
  const [prevAchievements] = useState(() => ({ ...achievements }))
  const [newlyUnlocked] = useState(() =>
    ACHIEVEMENTS.filter((a) => !prevAchievements[a.id] && achievements[a.id])
  )

  const mapName = map
    ? `${t.cartes.cardPrefix} ${String(map.num).padStart(2, "0")}`
    : t.cartes.cardLabel

  useEffect(() => {
    if (saved.current || !map) return
    saved.current = true
    recordResult({ mapId, mapName, time, stars, noCollision, won: stars > 0 })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const won = stars > 0
  const accent = map ? DIFF_COLOR[map.difficulty] : T.green

  return (
    <S.Screen>
      <S.Card>
        <S.AccentBar $color={won ? accent : "#ccc"} />
        <S.Sparkles>
          <S.Spark $color={T.red}><IoSparkles /></S.Spark>
          <S.Spark $color={T.gold}><IoSparkles /></S.Spark>
          <S.Spark $color={T.blue}><IoSparkles /></S.Spark>
        </S.Sparkles>
        <S.Heading>{won ? t.victoire.complete : t.victoire.fail}</S.Heading>

        <S.Stars>
          <S.Star $filled={stars >= 1} $big><IoStar /></S.Star>
          <S.Star $filled={stars >= 2} $big><IoStar /></S.Star>
          <S.Star $filled={stars >= 3} $big><IoStar /></S.Star>
        </S.Stars>

        <S.StatsBox>
          <S.StatsLabel>
            {mapName} · {t.victoire.timeLabel}
          </S.StatsLabel>
          <S.StatsTime $color={won ? accent : T.muted}>{formatTime(time)}</S.StatsTime>
        </S.StatsBox>

        <S.Record>
          {isNewRecord
            ? t.victoire.newRecord
            : prevBest
              ? `${t.victoire.bestLabel} : ${formatTime(prevBest)}`
              : ""}
        </S.Record>

        <S.Buttons>
          <S.BtnSecondary onClick={onRejouer}>
            <S.BtnIcon><IoRefresh /></S.BtnIcon>
            <S.BtnLabel>{t.victoire.rejouer}</S.BtnLabel>
          </S.BtnSecondary>
          {nextMap ? (
            <S.BtnPrimary onClick={onSuivant}>
              <S.BtnIcon $light><IoChevronForward /></S.BtnIcon>
              <S.BtnLabel $light>{t.victoire.suivant}</S.BtnLabel>
            </S.BtnPrimary>
          ) : (
            <S.BtnPrimary onClick={onCartes}>
              <S.BtnIcon $light><IoApps /></S.BtnIcon>
              <S.BtnLabel $light>{t.victoire.cartes}</S.BtnLabel>
            </S.BtnPrimary>
          )}
        </S.Buttons>
      </S.Card>

      {newlyUnlocked.map((a) => (
        <S.AchievementBanner key={a.id}>
          {a.icon} {t.hautsFaits.achievementBanner} : {t.achievements[a.id].name} !
        </S.AchievementBanner>
      ))}
    </S.Screen>
  )
}
