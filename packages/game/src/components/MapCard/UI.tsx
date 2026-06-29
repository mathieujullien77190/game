import styled from "styled-components/native"
import { T } from "theme"

export const Card = styled.TouchableOpacity<{ $locked: boolean; $accent: string }>`
  width: 30%;
  aspect-ratio: 1 / 1.1;
  border-radius: 14px;
  overflow: hidden;
  background-color: ${({ $locked }) => ($locked ? T.surfaceAlt : T.surface)};
  border-width: 1px;
  border-color: ${({ $locked, $accent }) => ($locked ? T.border : $accent)};
  align-items: center;
  justify-content: center;
  gap: 4px;
`

export const AccentBar = styled.View<{ $color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: ${({ $color }) => $color};
  border-radius: 14px 14px 0 0;
`

export const Label = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${T.muted};
`

export const Number = styled.Text<{ $locked: boolean }>`
  font-size: 28px;
  font-weight: 700;
  line-height: 30px;
  color: ${({ $locked }) => ($locked ? T.muted : T.navy)};
`

export const Stars = styled.View<{ $color: string }>`
  flex-direction: row;
  gap: 1px;
`

export const Time = styled.Text<{ $color: string }>`
  font-size: 9px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`

export const LockIcon = styled.View`
  opacity: 0.15;
  align-items: center;
  justify-content: center;
`
