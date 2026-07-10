import type { ReactNode } from "react"
import * as S from "./UI"

interface Props {
  label: string
  children: ReactNode
  $direction?: "row" | "column"
}

export const Field = ({ label, children, $direction = "column" }: Props) => (
  <S.Wrap $direction={$direction}>
    <S.Label $direction={$direction}>{label}</S.Label>
    {children}
  </S.Wrap>
)
