import type { Props } from "./types";
import * as S from "./UI";

export const Button = ({ color, children, onClick }: Props) => (
  <S.Root $color={color} type="button" onClick={onClick}>
    {children}
  </S.Root>
);
