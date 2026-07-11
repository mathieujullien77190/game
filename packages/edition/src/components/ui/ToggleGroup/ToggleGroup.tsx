import * as S from "./UI"
import type { Props } from "./types"

export const ToggleGroup = ({ children, $wrap = false, $equal = false }: Props) => (
  <S.Group $wrap={$wrap} $equal={$equal}>{children}</S.Group>
)
