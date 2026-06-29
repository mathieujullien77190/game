import { Ionicons } from "@expo/vector-icons"
import { useProgressStore, ACHIEVEMENTS } from "progressStore"
import { useLang } from "hooks/useLang"
import { useLangStore } from "langStore"
import Header from "components/Header"
import { ICON_COLORS, ICON_BGS } from "./constants"
import type { Props } from "./types"
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
            <S.IconCircle $color={ICON_COLORS[i % ICON_COLORS.length]} $bg={ICON_BGS[i % ICON_BGS.length]} $unlocked>
              <S.IconText $color={ICON_COLORS[i % ICON_COLORS.length]} $unlocked>{a.icon}</S.IconText>
            </S.IconCircle>
            <S.ItemTextWrap>
              <S.ItemTitle $unlocked>{t.achievements[a.id].name}</S.ItemTitle>
              <S.ItemDesc>{t.achievements[a.id].desc}</S.ItemDesc>
              <S.ItemDate $color={ICON_COLORS[i % ICON_COLORS.length]}>
                {t.hautsFaits.unlockedLabel} · {new Date(achievements[a.id]).toLocaleDateString(dateLocale)}
              </S.ItemDate>
            </S.ItemTextWrap>
          </S.Item>
        ))}

        {ACHIEVEMENTS.filter((a) => !achievements[a.id]).length > 0 && (
          <S.SectionLabel>{t.hautsFaits.locked}</S.SectionLabel>
        )}
        {ACHIEVEMENTS.filter((a) => !achievements[a.id]).map((a) => (
          <S.Item key={a.id} $unlocked={false}>
            <S.IconCircle $color="" $bg="" $unlocked={false}>
              <Ionicons name="lock-closed" size={18} color="#bbb" />
            </S.IconCircle>
            <S.ItemTextWrap>
              <S.ItemTitle $unlocked={false}>{t.achievements[a.id].name}</S.ItemTitle>
              <S.ItemDesc>{t.achievements[a.id].desc}</S.ItemDesc>
            </S.ItemTextWrap>
            <S.LockBadge>
              <Ionicons name="lock-closed" size={14} color="#999" />
            </S.LockBadge>
          </S.Item>
        ))}
      </S.List>
    </S.Screen>
  )
}
