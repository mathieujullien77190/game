import type { ReactNode } from "react"
import * as S from "./UI"

interface Props {
  children: ReactNode
  $wrap?: boolean
  $equal?: boolean
}

export const ToggleGroup = ({ children, $wrap = false, $equal = false }: Props) => (
  <S.Group $wrap={$wrap} $equal={$equal}>{children}</S.Group>
)
