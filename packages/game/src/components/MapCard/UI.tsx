import styled from "styled-components"
import { T } from "theme"

export const Card = styled.button<{ $locked: boolean; $accent: string }>`
  aspect-ratio: 1 / 1.1;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  background: ${({ $locked }) => ($locked ? T.surfaceAlt : T.surface)};
  border: 1px solid ${({ $locked, $accent }) => ($locked ? T.border : $accent)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: ${({ $locked }) => ($locked ? "default" : "pointer")};
  padding: 0;
  &:active {
    opacity: ${({ $locked }) => ($locked ? 1 : 0.8)};
  }
`

export const AccentBar = styled.div<{ $color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${({ $color }) => $color};
  border-radius: 14px 14px 0 0;
`

export const Label = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${T.muted};
`

export const Number = styled.div<{ $locked: boolean }>`
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  color: ${({ $locked }) => ($locked ? T.muted : T.navy)};
`

export const Stars = styled.div<{ $color: string }>`
  font-size: 16px;
  color: ${({ $color }) => $color};
  display: flex;
  gap: 1px;
`

export const Time = styled.div<{ $color: string }>`
  font-size: 9px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`

export const LockIcon = styled.div`
  font-size: 22px;
  opacity: 0.15;
  display: flex;
  align-items: center;
`
