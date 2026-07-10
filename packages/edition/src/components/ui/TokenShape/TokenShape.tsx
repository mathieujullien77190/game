import * as S from "./UI"

interface Props {
  $color: string
  $shape: string
  $size?: number
}

export const TokenShape = ({ $color, $shape, $size = 12 }: Props) => (
  <S.StyledTokenShape $color={$color} $shape={$shape} $size={$size} />
)
