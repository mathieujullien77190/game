import type { ReactNode } from "react"
import * as S from "./UI"

interface Props {
  children: ReactNode
}

export const Tag = ({ children }: Props) => <S.StyledTag>{children}</S.StyledTag>
