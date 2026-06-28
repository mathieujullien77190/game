import type { Props } from "./types"
import * as S from "./UI"

export const Button = ({ variant = "primary", onClick, children }: Props) => (
  <S.Btn $variant={variant} onClick={onClick}>
    {children}
  </S.Btn>
)
