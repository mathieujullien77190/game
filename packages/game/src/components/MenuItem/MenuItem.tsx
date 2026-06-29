import { Ionicons } from "@expo/vector-icons"
import { T } from "theme"
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
  <S.Row $clickable={!!onClick} onPress={onClick ?? undefined} activeOpacity={onClick ? 0.8 : 1}>
    <S.IconBox $color={iconColor ?? T.muted} $bg={iconBg ?? T.surfaceAlt}>
      {icon}
    </S.IconBox>
    <S.TextWrap>
      <S.Title>{title}</S.Title>
      {subtitle && <S.Sub>{subtitle}</S.Sub>}
    </S.TextWrap>
    {right ?? (
      <>
        {pill && pillColor && pillBg && (
          <S.Pill $color={pillColor} $bg={pillBg}>
            <S.PillText $color={pillColor}>{pill}</S.PillText>
          </S.Pill>
        )}
        {onClick && (
          <S.Arrow>
            <Ionicons name="chevron-forward" size={20} color={T.subtle} />
          </S.Arrow>
        )}
      </>
    )}
  </S.Row>
)
