import type { Props } from "./types";
import * as S from "./UI";

export const Tag = ({ color, bg, children, active, large, onClick }: Props) => (
  <S.Chip
    $color={color}
    $bg={bg}
    $clickable={!!onClick}
    $inactive={active === false}
    $large={large}
    onClick={onClick}
  >
    {children}
  </S.Chip>
);
