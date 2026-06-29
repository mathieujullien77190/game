import { Text } from "react-native"
import type { Props } from "./types"
import * as S from "./UI"

export const Button = ({ variant = "primary", onClick, children }: Props) => (
  <S.Btn $variant={variant} onPress={onClick} activeOpacity={0.85}>
    <S.BtnText $variant={variant}>{children}</S.BtnText>
  </S.Btn>
)
