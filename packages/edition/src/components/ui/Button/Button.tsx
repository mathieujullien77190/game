import * as S from "./UI"
import type { Props } from "./types"

export const Button = ({ children, onClick, $active = false, $accent = "#333", $full = false, $size = "md" }: Props) => (
  <S.StyledButton $active={$active} $accent={$accent} $full={$full} $size={$size} onClick={onClick}>
    {children}
  </S.StyledButton>
)
