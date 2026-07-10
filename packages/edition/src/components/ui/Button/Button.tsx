import type { ReactNode } from "react"
import * as S from "./UI"

interface Props {
  children: ReactNode
  onClick: () => void
  $active?: boolean
  $accent?: string
  $full?: boolean
  $size?: "sm" | "md"
}

export const Button = ({ children, onClick, $active = false, $accent = "#333", $full = false, $size = "md" }: Props) => (
  <S.StyledButton $active={$active} $accent={$accent} $full={$full} $size={$size} onClick={onClick}>
    {children}
  </S.StyledButton>
)
