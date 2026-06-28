import { useProgressStore } from "progressStore"
import { MAP_LIST } from "maps"
import { useLang } from "hooks/useLang"
import Header from "components/Header"
import MapCard from "components/MapCard"
import type { Props } from "./types"
import { DIFF_ACCENT, DIFFICULTIES } from "./constants"
import { isLocked } from "./helpers"
import * as S from "./UI"

export const Cartes = ({ onBack, onSelect }: Props) => {
  const t = useLang()
  const results = useProgressStore((s) => s.results)

  return (
    <S.Screen>
      <Header title={t.cartes.title} onBack={onBack} />

      <S.ScrollArea>
        {DIFFICULTIES.map((diff) => {
          const maps = MAP_LIST.filter((m) => m.difficulty === diff)
          if (maps.length === 0) return null
          const accent = DIFF_ACCENT[diff]
          return (
            <S.Section key={diff}>
              <S.SectionTitle>{t.difficulties[diff].toUpperCase()}</S.SectionTitle>
              <S.Grid>
                {maps.map((map) => {
                  const idx = MAP_LIST.indexOf(map)
                  const locked = isLocked(idx, results)
                  return (
                    <MapCard
                      key={map.id}
                      num={map.num}
                      locked={locked}
                      accent={accent}
                      label={t.cartes.cardLabel}
                      result={results[map.id]}
                      onClick={() => onSelect(map.id)}
                    />
                  )
                })}
              </S.Grid>
            </S.Section>
          )
        })}
      </S.ScrollArea>
    </S.Screen>
  )
}
