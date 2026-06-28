import styled from "styled-components"
import { T } from "theme"

export const Row = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: 16px;
  text-align: left;
  width: 100%;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  &:active {
    background: ${({ $clickable }) => ($clickable ? T.surfaceAlt : T.surface)};
  }
`

export const IconBox = styled.div<{ $color: string; $bg: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`

export const Text = styled.div`
  flex: 1;
`

export const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${T.navy};
  margin-bottom: 3px;
`

export const Sub = styled.div`
  font-size: 12px;
  color: ${T.muted};
`

export const Pill = styled.div<{ $color: string; $bg: string }>`
  padding: 3px 10px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`

export const Arrow = styled.div`
  font-size: 20px;
  color: ${T.subtle};
  display: flex;
  align-items: center;
`
