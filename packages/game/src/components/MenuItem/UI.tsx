import styled from "styled-components/native"
import { T } from "theme"

export const Row = styled.TouchableOpacity<{ $clickable: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background-color: ${T.surface};
  border-width: 1px;
  border-color: ${T.border};
  border-radius: 16px;
  width: 100%;
`

export const IconBox = styled.View<{ $color: string; $bg: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${({ $bg }) => $bg};
  align-items: center;
  justify-content: center;
`

export const TextWrap = styled.View`
  flex: 1;
`

export const Title = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${T.navy};
  margin-bottom: 3px;
`

export const Sub = styled.Text`
  font-size: 12px;
  color: ${T.muted};
`

export const Pill = styled.View<{ $color: string; $bg: string }>`
  padding-horizontal: 10px;
  padding-vertical: 3px;
  border-radius: 10px;
  background-color: ${({ $bg }) => $bg};
`

export const PillText = styled.Text<{ $color: string }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`

export const Arrow = styled.View`
  align-items: center;
  justify-content: center;
`
