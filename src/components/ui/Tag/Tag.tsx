import type { Props } from "./types";
import * as S from "./UI";

export const Tag = ({ color, bg, children, active, onClick }: Props) => (
  <S.Chip
    $color={color}
    $bg={bg}
    $clickable={!!onClick}
    $inactive={active === false}
    onClick={onClick}
  >
    {children}
  </S.Chip>
);
