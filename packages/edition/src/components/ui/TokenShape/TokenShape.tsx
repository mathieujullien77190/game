import * as S from "./UI"
import type { Props } from "./types"

export const TokenShape = ({ $color, $shape, $size = 12 }: Props) => (
  <S.StyledTokenShape $color={$color} $shape={$shape} $size={$size} />
)
