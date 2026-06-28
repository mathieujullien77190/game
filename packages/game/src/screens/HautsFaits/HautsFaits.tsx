import { IoLockClosed } from "react-icons/io5"
import { useProgressStore, ACHIEVEMENTS } from "progressStore"
import { useLang } from "hooks/useLang"
import { useLangStore } from "langStore"
import Header from "components/Header"
import type { Props } from "./types"
import { ICON_COLORS, ICON_BGS } from "./constants"
import * as S from "./UI"

export const HautsFaits = ({ onBack }: Props) => {
  const t = useLang()
  const lang = useLangStore((s) => s.lang)
  const achievements = useProgressStore((s) => s.achievements)
  const unlocked = Object.keys(achievements).length
  const total = ACHIEVEMENTS.length
  const pct = Math.round((unlocked / total) * 100)
  const dateLocale = lang === "fr" ? "fr-FR" : "en-US"

  return (
    <S.Screen>
      <Header
        title={t.hautsFaits.title}
        onBack={onBack}
        right={
          <S.Count>
            {unlocked} / {total}
          </S.Count>
        }
      />
      <S.ProgressBar>
        <S.ProgressFill $pct={pct} />
      </S.ProgressBar>

      <S.List>
        <S.SectionLabel>{t.hautsFaits.unlocked}</S.SectionLabel>
        {ACHIEVEMENTS.filter((a) => achievements[a.id]).map((a, i) => (
          <S.Item key={a.id} $unlocked>
            <S.ItemAccent $color={ICON_COLORS[i % ICON_COLORS.length]} />
            <S.IconCircle
              $color={ICON_COLORS[i % ICON_COLORS.length]}
              $bg={ICON_BGS[i % ICON_BGS.length]}
              $unlocked
            >
              {a.icon}
            </S.IconCircle>
            <S.ItemText>
              <S.ItemTitle $unlocked>{t.achievements[a.id].name}</S.ItemTitle>
              <S.ItemDesc>{t.achievements[a.id].desc}</S.ItemDesc>
              <S.ItemDate $color={ICON_COLORS[i % ICON_COLORS.length]}>
                {t.hautsFaits.unlockedLabel} ·{" "}
                {new Date(achievements[a.id]).toLocaleDateString(dateLocale)}
              </S.ItemDate>
            </S.ItemText>
          </S.Item>
        ))}

        {ACHIEVEMENTS.filter((a) => !achievements[a.id]).length > 0 && (
          <S.SectionLabel>{t.hautsFaits.locked}</S.SectionLabel>
        )}
        {ACHIEVEMENTS.filter((a) => !achievements[a.id]).map((a) => (
          <S.Item key={a.id} $unlocked={false}>
            <S.IconCircle $color="" $bg="" $unlocked={false}>
              <IoLockClosed />
            </S.IconCircle>
            <S.ItemText>
              <S.ItemTitle $unlocked={false}>{t.achievements[a.id].name}</S.ItemTitle>
              <S.ItemDesc>{t.achievements[a.id].desc}</S.ItemDesc>
            </S.ItemText>
            <S.LockBadge><IoLockClosed /></S.LockBadge>
          </S.Item>
        ))}
      </S.List>
    </S.Screen>
  )
}
