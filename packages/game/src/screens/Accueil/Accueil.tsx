import { useLang } from "hooks/useLang"
import TickwireLogo from "components/logo"
import Button from "components/Button"
import type { Props } from "./types"
import * as S from "./UI"

export const Accueil = ({ onJouer, onMenu }: Props) => {
  const t = useLang()

  return (
    <S.Screen>
      <S.LogoWrap>
        <TickwireLogo />
      </S.LogoWrap>
      <S.AppName>{t.app.name}</S.AppName>
      <S.Underline />
      <S.Tagline>{t.app.tagline}</S.Tagline>
      <S.ButtonGroup>
        <Button variant="primary" onClick={onJouer}>
          {t.accueil.jouer}
        </Button>
        <Button variant="secondary" onClick={onMenu}>
          {t.accueil.menu}
        </Button>
      </S.ButtonGroup>
      <S.Progress>{t.app.version}</S.Progress>
    </S.Screen>
  )
}
