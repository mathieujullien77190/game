import { Ionicons } from "@expo/vector-icons"
import { T } from "theme"
import type { Props } from "./types"
import * as S from "./UI"

export const Header = ({ title, onBack, right }: Props) => (
  <S.Wrap>
    <S.BackBtn onPress={onBack} activeOpacity={0.7}>
      <Ionicons name="chevron-back" size={24} color={T.muted} />
    </S.BackBtn>
    <S.Title>{title}</S.Title>
    {right ?? <S.Spacer />}
  </S.Wrap>
)
