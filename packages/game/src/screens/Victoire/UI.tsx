import styled from "styled-components/native"
import { T } from "theme"

export const Screen = styled.View`
  flex: 1;
  background-color: ${T.bg};
  align-items: center;
  justify-content: center;
  padding: 24px;
`

export const Card = styled.View`
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

export const AccentBar = styled.View<{ $color: string }>`
  width: 100%;
  height: 5px;
  background-color: ${({ $color }) => $color};
  margin-top: -32px;
  margin-bottom: 24px;
  align-self: stretch;
`

export const Sparkles = styled.View`
  flex-direction: row;
  gap: 16px;
  margin-bottom: 8px;
`

export const Heading = styled.Text`
  font-size: 22px;
  font-weight: 300;
  color: ${T.navy};
  letter-spacing: 0.5px;
  margin-bottom: 20px;
`

export const Stars = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
`

export const StatsBox = styled.View`
  width: 100%;
  background-color: ${T.bg};
  border-radius: 12px;
  padding: 12px 20px 14px;
  align-items: center;
  margin-bottom: 10px;
`

export const StatsLabel = styled.Text`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${T.muted};
  margin-bottom: 6px;
`

export const StatsTime = styled.Text<{ $color: string }>`
  font-size: 26px;
  font-weight: 300;
  color: ${({ $color }) => $color};
`

export const Record = styled.Text`
  font-size: 12px;
  color: ${T.muted};
  margin-bottom: 20px;
`

export const Buttons = styled.View`
  flex-direction: row;
  gap: 12px;
  width: 100%;
`

export const BtnSecondary = styled.TouchableOpacity`
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

export const BtnPrimary = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  border-radius: 12px;
  background-color: ${T.red};
  align-items: center;
  justify-content: center;
  gap: 2px;
`

export const BtnLabel = styled.Text<{ $light?: boolean }>`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${({ $light }) => ($light ? "#fff" : T.muted)};
`

export const AchievementBanner = styled.View`
  margin-top: 14px;
  width: 100%;
  max-width: 360px;
  padding: 10px 16px;
  background-color: #eef4ff;
  border-width: 1px;
  border-color: rgba(58, 111, 216, 0.25);
  border-radius: 10px;
  align-items: center;
`

export const AchievementText = styled.Text`
  font-size: 12px;
  color: ${T.blue};
  text-align: center;
`
