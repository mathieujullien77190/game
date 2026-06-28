import styled, { keyframes } from "styled-components"
import { T } from "theme"

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const Screen = styled.div`
  width: 100%;
  height: 100%;
  background: ${T.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ${fadeUp} 0.4s ease;
`

export const Card = styled.div`
  width: 100%;
  max-width: 360px;
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px 28px;
  gap: 0;
`

export const AccentBar = styled.div<{ $color: string }>`
  width: 100%;
  height: 5px;
  background: ${({ $color }) => $color};
  margin: -32px -24px 24px;
  align-self: stretch;
`

export const Sparkles = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
`

export const Spark = styled.span<{ $color: string }>`
  font-size: 20px;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
`

export const Heading = styled.div`
  font-size: 22px;
  font-weight: 300;
  color: ${T.navy};
  letter-spacing: 0.5px;
  margin-bottom: 20px;
`

export const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
`

export const Star = styled.span<{ $filled: boolean; $big?: boolean }>`
  font-size: ${({ $big }) => ($big ? "48px" : "36px")};
  color: ${({ $filled }) => ($filled ? T.gold : T.border)};
  display: inline-flex;
  align-items: center;
`

export const StatsBox = styled.div`
  width: 100%;
  background: ${T.bg};
  border-radius: 12px;
  padding: 12px 20px 14px;
  text-align: center;
  margin-bottom: 10px;
`

export const StatsLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${T.muted};
  margin-bottom: 6px;
`

export const StatsTime = styled.div<{ $color: string }>`
  font-size: 26px;
  font-weight: 300;
  font-family: inherit;
  color: ${({ $color }) => $color};
`

export const Record = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-bottom: 20px;
`

export const Buttons = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`

export const BtnSecondary = styled.button`
  flex: 1;
  height: 52px;
  border-radius: 12px;
  background: ${T.bg};
  border: 1px solid ${T.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  &:active {
    opacity: 0.7;
  }
`

export const BtnPrimary = styled.button`
  flex: 1;
  height: 52px;
  border-radius: 12px;
  background: ${T.red};
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  &:active {
    opacity: 0.85;
  }
`

export const BtnIcon = styled.div<{ $light?: boolean }>`
  font-size: 18px;
  color: ${({ $light }) => ($light ? "#fff" : T.navy)};
  opacity: ${({ $light }) => ($light ? 1 : 0.6)};
`

export const BtnLabel = styled.div<{ $light?: boolean }>`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${({ $light }) => ($light ? "#fff" : T.muted)};
`

export const AchievementBanner = styled.div`
  margin-top: 14px;
  width: 100%;
  max-width: 360px;
  padding: 10px 16px;
  background: #eef4ff;
  border: 1px solid rgba(58, 111, 216, 0.25);
  border-radius: 10px;
  font-size: 12px;
  color: ${T.blue};
  text-align: center;
`
