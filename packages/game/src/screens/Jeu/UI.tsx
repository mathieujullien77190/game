import styled from "styled-components/native"
import { T } from "theme"

export const Screen = styled.View`
  flex: 1;
  background-color: #fff;
`

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  height: 64px;
  padding-horizontal: 20px;
  background-color: ${T.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${T.border};
  gap: 12px;
`

export const BackBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: 4px;
`

export const MapName = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${T.navy};
  flex: 1;
`

export const PauseBtn = styled.TouchableOpacity`
  width: 64px;
  height: 32px;
  border-radius: 8px;
  background-color: ${T.surfaceAlt};
  align-items: center;
  justify-content: center;
`

export const Timer = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: #000000;
  min-width: 52px;
  text-align: right;
`

export const CanvasArea = styled.View`
  flex: 1;
  overflow: hidden;
`

export const PauseOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
`

export const PauseTitle = styled.Text`
  font-size: 22px;
  font-weight: 300;
  color: ${T.navy};
  letter-spacing: 2px;
`

export const PauseBtn2 = styled.TouchableOpacity`
  padding: 12px 32px;
  border-radius: 12px;
  background-color: ${T.red};
  align-items: center;
  justify-content: center;
`

export const PauseBtn2Text = styled.Text`
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
`

export const WinOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 20;
`

export const WinCard = styled.View`
  width: 100%;
  max-width: 360px;
  background-color: ${T.surface};
  border-width: 1px;
  border-color: ${T.border};
  border-radius: 24px;
  overflow: hidden;
  align-items: center;
  padding: 32px 24px 28px;
`

export const WinHeading = styled.Text`
  font-size: 22px;
  font-weight: 300;
  color: ${T.navy};
  letter-spacing: 0.5px;
  margin-bottom: 20px;
`

export const WinStars = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
`

export const WinStatsBox = styled.View`
  width: 100%;
  background-color: ${T.bg};
  border-radius: 12px;
  padding: 12px 20px 14px;
  align-items: center;
  margin-bottom: 10px;
`

export const WinStatsLabel = styled.Text`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${T.muted};
  margin-bottom: 6px;
`

export const WinStatsTime = styled.Text<{ $color: string }>`
  font-size: 26px;
  font-weight: 300;
  color: ${({ $color }) => $color};
`

export const WinRecord = styled.Text`
  font-size: 12px;
  color: ${T.muted};
  margin-bottom: 20px;
`

export const WinButtons = styled.View`
  flex-direction: row;
  gap: 12px;
  width: 100%;
`

export const WinBtnSecondary = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  border-radius: 12px;
  background-color: ${T.bg};
  border-width: 1px;
  border-color: ${T.border};
  align-items: center;
  justify-content: center;
  gap: 2px;
`

export const WinBtnPrimary = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  border-radius: 12px;
  background-color: ${T.red};
  align-items: center;
  justify-content: center;
  gap: 2px;
`

export const WinBtnLabel = styled.Text<{ $light?: boolean }>`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${({ $light }) => ($light ? "#fff" : T.muted)};
`

export const LoadingWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const LoadingText = styled.Text`
  color: ${T.muted};
  font-size: 13px;
  letter-spacing: 1px;
`
