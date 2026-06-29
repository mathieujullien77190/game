import styled from "styled-components/native"
import { T } from "theme"

export const Screen = styled.View`
  flex: 1;
  background-color: ${T.bg};
`

export const Count = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${T.gold};
  min-width: 40px;
  text-align: right;
`

export const ProgressBar = styled.View`
  height: 5px;
  background-color: ${T.border};
`

export const ProgressFill = styled.View<{ $pct: number }>`
  height: 5px;
  width: ${({ $pct }) => $pct}%;
  background-color: ${T.red};
  border-radius: 2px;
`

export const List = styled.ScrollView.attrs({ contentContainerStyle: { padding: 12, paddingHorizontal: 16, gap: 8 } })``

export const SectionLabel = styled.Text`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${T.muted};
  margin-top: 8px;
  margin-left: 2px;
`

export const Item = styled.View<{ $unlocked: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background-color: ${({ $unlocked }) => ($unlocked ? T.surface : T.surfaceAlt)};
  border-radius: 14px;
  overflow: hidden;
`

export const ItemAccent = styled.View<{ $color: string }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: ${({ $color }) => $color};
`

export const IconCircle = styled.View<{ $color: string; $bg: string; $unlocked: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({ $bg, $unlocked }) => ($unlocked ? $bg : T.border)};
  align-items: center;
  justify-content: center;
`

export const IconText = styled.Text<{ $color: string; $unlocked: boolean }>`
  font-size: 20px;
  color: ${({ $color, $unlocked }) => ($unlocked ? $color : "#bbb")};
`

export const ItemTextWrap = styled.View`
  flex: 1;
`

export const ItemTitle = styled.Text<{ $unlocked: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $unlocked }) => ($unlocked ? T.navy : T.muted)};
  margin-bottom: 2px;
`

export const ItemDesc = styled.Text`
  font-size: 11px;
  color: ${T.muted};
`

export const ItemDate = styled.Text<{ $color: string }>`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${({ $color }) => $color};
  margin-top: 3px;
`

export const LockBadge = styled.View`
  opacity: 0.2;
  align-items: center;
  justify-content: center;
`
