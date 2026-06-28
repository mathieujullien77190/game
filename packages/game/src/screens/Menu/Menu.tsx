import { IoApps, IoStar, IoSettings, IoInformationCircle } from "react-icons/io5"
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
          icon={<IoApps />}
          iconColor={T.red}
          iconBg="#FEF0EC"
          title={t.menu.cartes}
          subtitle={t.menu.cartesDesc}
          onClick={onCartes}
        />
        <MenuItem
          icon={<IoStar />}
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
          icon={<IoSettings />}
          iconColor={T.blue}
          iconBg="#EEF4FF"
          title={t.menu.options}
          subtitle={t.menu.optionsDesc}
          onClick={onOptions}
        />
        <MenuItem
          icon={<IoInformationCircle />}
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
