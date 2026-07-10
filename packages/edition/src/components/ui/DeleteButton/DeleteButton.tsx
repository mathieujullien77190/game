import * as S from "./UI"

interface Props {
  onClick: () => void
  $size?: number
}

export const DeleteButton = ({ onClick, $size = 12 }: Props) => (
  <S.StyledDeleteButton onClick={onClick} $size={$size}>✕</S.StyledDeleteButton>
)
