import { Ionicons } from "@expo/vector-icons"
import { useProgressStore, ACHIEVEMENTS } from "progressStore"
import { useLang } from "hooks/useLang"
import { T } from "theme"
import Header from "components/Header"
import MenuItem from "components/MenuItem"
import type { Props } from "./types"
import * as S from "./UI"

export const Menu = ({ onBack, onCartes, onHautsFaits, onOptions, onAPropos }: Props) => {
  const t = useLang()
  const achievements = useProgressStore((s) => s.achievements)
  const unlocked = Object.keys(achievements).length
  const total = ACHIEVEMENTS.length
  const pct = Math.round((unlocked / total) * 100)

  return (
    <S.Screen>
      <Header title={t.menu.title} onBack={onBack} />
      <S.List>
        <MenuItem
          icon={<Ionicons name="apps" size={22} color={T.red} />}
          iconColor={T.red}
          iconBg="#FEF0EC"
          title={t.menu.cartes}
          subtitle={t.menu.cartesDesc}
          onClick={onCartes}
        />
        <MenuItem
          icon={<Ionicons name="star" size={22} color={T.gold} />}
          iconColor={T.gold}
          iconBg="#FFF8EC"
          title={t.menu.hautsFaits}
          subtitle={`${unlocked} / ${total} ${t.menu.hautsFaitsUnlocked}`}
          pill={`${pct} %`}
          pillColor={T.gold}
          pillBg="#FFF8EC"
          onClick={onHautsFaits}
        />
        <MenuItem
          icon={<Ionicons name="settings" size={22} color={T.blue} />}
          iconColor={T.blue}
          iconBg="#EEF4FF"
          title={t.menu.options}
          subtitle={t.menu.optionsDesc}
          onClick={onOptions}
        />
        <MenuItem
          icon={<Ionicons name="information-circle" size={22} color={T.green} />}
          iconColor={T.green}
          iconBg="#F0FBF6"
          title={t.menu.aPropos}
          subtitle={t.menu.aProposDesc}
          onClick={onAPropos}
        />
      </S.List>
      <S.Footer>
        <S.FooterLogo>{t.menu.footer}</S.FooterLogo>
      </S.Footer>
    </S.Screen>
  )
}
