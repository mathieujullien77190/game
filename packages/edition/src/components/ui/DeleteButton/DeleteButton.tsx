import * as S from "./UI"
import type { Props } from "./types"

export const DeleteButton = ({ onClick, $size = 12 }: Props) => (
  <S.StyledDeleteButton onClick={onClick} $size={$size}>✕</S.StyledDeleteButton>
)
