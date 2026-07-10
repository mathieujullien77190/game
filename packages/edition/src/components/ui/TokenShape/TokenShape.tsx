import * as S from "./UI"

interface Props {
  $color: string
  $round: boolean
  $size?: number
}

export const TokenShape = ({ $color, $round, $size = 12 }: Props) => (
  <S.StyledTokenShape $color={$color} $round={$round} $size={$size} />
)
