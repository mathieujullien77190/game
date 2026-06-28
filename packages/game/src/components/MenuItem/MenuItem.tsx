import { IoChevronForward } from "react-icons/io5"
import type { Props } from "./types"
import * as S from "./UI"

export const MenuItem = ({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  pill,
  pillColor,
  pillBg,
  right,
  onClick,
}: Props) => (
  <S.Row $clickable={!!onClick} onClick={onClick}>
    <S.IconBox $color={iconColor} $bg={iconBg}>
      {icon}
    </S.IconBox>
    <S.Text>
      <S.Title>{title}</S.Title>
      {subtitle && <S.Sub>{subtitle}</S.Sub>}
    </S.Text>
    {right ?? (
      <>
        {pill && pillColor && pillBg && (
          <S.Pill $color={pillColor} $bg={pillBg}>
            {pill}
          </S.Pill>
        )}
        {onClick && <S.Arrow><IoChevronForward /></S.Arrow>}
      </>
    )}
  </S.Row>
)
