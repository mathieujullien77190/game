import * as S from "./UI"
import type { Props } from "./types"

export const Card = ({ children, $accent, $nested = false, onMouseEnter, onMouseLeave }: Props) => (
  <S.StyledCard $accent={$accent} $nested={$nested} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {children}
  </S.StyledCard>
)
