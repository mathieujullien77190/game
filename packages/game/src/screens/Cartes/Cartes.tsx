import { useProgressStore } from "progressStore"
import { useLang } from "hooks/useLang"
import { useEditorMaps } from "hooks/useEditorMaps"
import Header from "components/Header"
import MapCard from "components/MapCard"
import type { Props } from "./types"
import { DIFF_ACCENT, DIFFICULTIES } from "./constants"
import * as S from "./UI"

export const Cartes = ({ onBack, onSelect }: Props) => {
  const t = useLang()
  const results = useProgressStore((s) => s.results)
  const allMaps = useEditorMaps()

  return (
    <S.Screen>
      <Header title={t.cartes.title} onBack={onBack} />
      <S.ScrollArea>
        {DIFFICULTIES.map((diff) => {
          const maps = allMaps.filter((m) => m.difficulty === diff)
          if (maps.length === 0) return null
          const accent = DIFF_ACCENT[diff]
          return (
            <S.Section key={diff}>
              <S.SectionTitle>{(t.difficulties[diff] ?? diff).toUpperCase()}</S.SectionTitle>
              <S.Grid>
                {maps.map((map) => (
                  <MapCard
                    key={map.id}
                    num={map.num}
                    locked={false}
                    accent={accent}
                    label={t.cartes.cardLabel}
                    result={results[map.id]}
                    onClick={() => onSelect(map.id)}
                  />
                ))}
              </S.Grid>
            </S.Section>
          )
        })}
        {allMaps.length === 0 && (
          <S.Section>
            <S.SectionTitle>AUCUNE CARTE</S.SectionTitle>
          </S.Section>
        )}
      </S.ScrollArea>
    </S.Screen>
  )
}
