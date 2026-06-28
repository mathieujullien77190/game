import { useLang } from "hooks/useLang"
import Header from "components/Header"
import type { Props } from "./types"
import * as S from "./UI"

export const APropos = ({ onBack }: Props) => {
  const t = useLang()
  return (
    <S.Screen>
      <Header title={t.aPropos.title} onBack={onBack} />
      <S.Body>
        <S.AppName>{t.app.name}</S.AppName>
        <S.Line />
        <S.Sub>
          {t.aPropos.version}
          {"\n"}
          {t.aPropos.subtitle}
          {"\n"}
          {"\n"}
          {t.aPropos.credit}
        </S.Sub>
      </S.Body>
    </S.Screen>
  )
}
