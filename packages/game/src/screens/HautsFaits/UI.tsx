import styled from "styled-components"
import { T } from "theme"

export const Screen = styled.div`
  width: 100%;
  height: 100%;
  background: ${T.bg};
  display: flex;
  flex-direction: column;
`

export const Count = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${T.gold};
`

export const ProgressBar = styled.div`
  height: 5px;
  background: ${T.border};
  flex-shrink: 0;
`

export const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${T.red};
  border-radius: 0 2px 2px 0;
  transition: width 0.4s ease;
`

export const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${T.muted};
  margin: 8px 2px 4px;
`

export const Item = styled.div<{ $unlocked: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: ${({ $unlocked }) => ($unlocked ? T.surface : T.surfaceAlt)};
  border-radius: 14px;
  position: relative;
  overflow: hidden;
`

export const ItemAccent = styled.div<{ $color: string }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: ${({ $color }) => $color};
  border-radius: 14px 0 0 14px;
`

export const IconCircle = styled.div<{ $color: string; $bg: string; $unlocked: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ $bg, $unlocked }) => ($unlocked ? $bg : T.border)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: ${({ $color, $unlocked }) => ($unlocked ? $color : "#bbb")};
  flex-shrink: 0;
`

export const ItemText = styled.div`
  flex: 1;
`

export const ItemTitle = styled.div<{ $unlocked: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $unlocked }) => ($unlocked ? T.navy : T.muted)};
  margin-bottom: 2px;
`

export const ItemDesc = styled.div`
  font-size: 11px;
  color: ${T.muted};
`

export const ItemDate = styled.div<{ $color: string }>`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${({ $color }) => $color};
  margin-top: 3px;
`

export const LockBadge = styled.div`
  font-size: 14px;
  opacity: 0.2;
`
