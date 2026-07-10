import type { ReactNode, MouseEventHandler } from "react"
import * as S from "./UI"

interface Props {
  children: ReactNode
  $accent?: string
  $nested?: boolean
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
}

export const Card = ({ children, $accent, $nested = false, onMouseEnter, onMouseLeave }: Props) => (
  <S.StyledCard $accent={$accent} $nested={$nested} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {children}
  </S.StyledCard>
)
