import { IoEarth, IoConstruct } from "react-icons/io5"
import { useShallow } from "zustand/react/shallow"
import { useLang } from "hooks/useLang"
import { useLangStore } from "langStore"
import { useDevStore } from "devStore"
import { T } from "theme"
import Header from "components/Header"
import MenuItem from "components/MenuItem"
import type { Props } from "./types"
import * as S from "./UI"

export const Options = ({ onBack }: Props) => {
  const t = useLang()
  const { lang, setLang } = useLangStore(useShallow((s) => ({ lang: s.lang, setLang: s.setLang })))
  const { devMode, toggleDevMode } = useDevStore(
    useShallow((s) => ({ devMode: s.devMode, toggleDevMode: s.toggleDevMode }))
  )

  return (
    <S.Screen>
      <Header title={t.options.title} onBack={onBack} />
      <S.List>
        <MenuItem
          icon={<IoEarth />}
          iconColor={T.blue}
          iconBg="#EEF4FF"
          title={t.options.language}
          right={
            <S.ChipGroup>
              <S.Chip $active={lang === "fr"} $color={T.navy} onClick={() => setLang("fr")}>
                {t.options.langFr}
              </S.Chip>
              <S.Chip $active={lang === "en"} $color={T.navy} onClick={() => setLang("en")}>
                {t.options.langEn}
              </S.Chip>
            </S.ChipGroup>
          }
        />
        <MenuItem
          icon={<IoConstruct />}
          iconColor={T.red}
          iconBg="#FEF0EC"
          title="Mode dev"
          right={
            <S.Toggle $active={devMode} onClick={toggleDevMode}>
              {devMode ? "ON" : "OFF"}
            </S.Toggle>
          }
        />
      </S.List>
    </S.Screen>
  )
}
