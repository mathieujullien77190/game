import styled from "styled-components"
import { T } from "theme"

export const Screen = styled.div`
  width: 100%;
  height: 100%;
  background: ${T.bg};
  display: flex;
  flex-direction: column;
`

export const List = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const ChipGroup = styled.div`
  display: flex;
  gap: 6px;
`

export const Chip = styled.button<{ $active: boolean; $color: string }>`
  height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1.5px solid;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  border-color: ${({ $active, $color }) => ($active ? $color : T.border)};
  background: ${({ $active, $color }) => ($active ? $color : T.surface)};
  color: ${({ $active }) => ($active ? "#fff" : T.muted)};
`

export const Toggle = styled.button<{ $active: boolean }>`
  height: 34px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1.5px solid;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  border-color: ${({ $active }) => ($active ? T.red : T.border)};
  background: ${({ $active }) => ($active ? T.red : T.surface)};
  color: ${({ $active }) => ($active ? "#fff" : T.muted)};
`
