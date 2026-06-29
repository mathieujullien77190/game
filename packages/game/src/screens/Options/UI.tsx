import styled from "styled-components/native"
import { T } from "theme"

export const Screen = styled.View`
  flex: 1;
  background-color: ${T.bg};
`

export const List = styled.View`
  flex: 1;
  padding: 16px;
  gap: 10px;
`

export const ChipGroup = styled.View`
  flex-direction: row;
  gap: 6px;
`

export const Chip = styled.TouchableOpacity<{ $active: boolean; $color: string }>`
  height: 34px;
  padding-horizontal: 14px;
  border-radius: 10px;
  border-width: 1.5px;
  align-items: center;
  justify-content: center;
  border-color: ${({ $active, $color }) => ($active ? $color : T.border)};
  background-color: ${({ $active, $color }) => ($active ? $color : T.surface)};
`

export const ChipText = styled.Text<{ $active: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#fff" : T.muted)};
`

export const Toggle = styled.TouchableOpacity<{ $active: boolean }>`
  height: 34px;
  padding-horizontal: 16px;
  border-radius: 10px;
  border-width: 1.5px;
  align-items: center;
  justify-content: center;
  border-color: ${({ $active }) => ($active ? T.red : T.border)};
  background-color: ${({ $active }) => ($active ? T.red : T.surface)};
`

export const ToggleText = styled.Text<{ $active: boolean }>`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${({ $active }) => ($active ? "#fff" : T.muted)};
`
