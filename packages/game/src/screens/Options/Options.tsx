import { Ionicons } from "@expo/vector-icons"
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
          icon={<Ionicons name="earth" size={22} color={T.blue} />}
          iconColor={T.blue}
          iconBg="#EEF4FF"
          title={t.options.language}
          right={
            <S.ChipGroup>
              <S.Chip $active={lang === "fr"} $color={T.navy} onPress={() => setLang("fr")} activeOpacity={0.8}>
                <S.ChipText $active={lang === "fr"}>{t.options.langFr}</S.ChipText>
              </S.Chip>
              <S.Chip $active={lang === "en"} $color={T.navy} onPress={() => setLang("en")} activeOpacity={0.8}>
                <S.ChipText $active={lang === "en"}>{t.options.langEn}</S.ChipText>
              </S.Chip>
            </S.ChipGroup>
          }
        />
        <MenuItem
          icon={<Ionicons name="construct" size={22} color={T.red} />}
          iconColor={T.red}
          iconBg="#FEF0EC"
          title="Mode dev"
          right={
            <S.Toggle $active={devMode} onPress={toggleDevMode} activeOpacity={0.8}>
              <S.ToggleText $active={devMode}>{devMode ? "ON" : "OFF"}</S.ToggleText>
            </S.Toggle>
          }
        />
      </S.List>
    </S.Screen>
  )
}
