import styled, { keyframes } from "styled-components"
import { T } from "theme"

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const Screen = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  background: ${T.surface};
  border-bottom: 1px solid ${T.border};
  flex-shrink: 0;
  gap: 12px;
`

export const BackBtn = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: ${T.muted};
  cursor: pointer;
  padding: 0;
`

export const MapName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${T.navy};
  flex: 1;
`

export const PauseBtn = styled.button`
  width: 64px;
  height: 32px;
  border-radius: 8px;
  background: ${T.surfaceAlt};
  border: none;
  font-size: 15px;
  color: ${T.navy};
  cursor: pointer;
  &:active {
    opacity: 0.7;
  }
`

export const Timer = styled.div`
  font-size: 17px;
  font-weight: 700;
  font-family: inherit;
  color: #000000;
  min-width: 52px;
  text-align: right;
`

export const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`

export const PauseOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
  pointer-events: none;
`

export const PauseTitle = styled.div`
  font-size: 22px;
  font-weight: 300;
  color: ${T.navy};
  letter-spacing: 2px;
`

export const PauseBtn2 = styled.button`
  pointer-events: auto;
  padding: 12px 32px;
  border-radius: 12px;
  background: ${T.red};
  color: #fff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
`

export const WonLabel = styled.div`
  font-size: 22px;
  font-weight: 300;
  color: ${T.navy};
  letter-spacing: 2px;
`

export const HelpOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.4s ease;
`

export const HelpBox = styled.div<{ $x: number; $y: number; $arrow: string }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  background: white;
  border: 2px solid #ddd;
  border-radius: 5px;
  padding: 10px 14px;
  font-size: 13px;
  color: #333;
  max-width: 180px;
  min-width: 80px;
  word-wrap: break-word;
  white-space: pre-wrap;
  pointer-events: none;

  ${({ $arrow }) => $arrow === "left" && `
    &::before {
      content: "";
      position: absolute;
      left: -9px; top: 50%; transform: translateY(-50%);
      border: 9px solid transparent;
      border-right-color: #ddd;
      border-left: none;
    }
    &::after {
      content: "";
      position: absolute;
      left: -7px; top: 50%; transform: translateY(-50%);
      border: 8px solid transparent;
      border-right-color: white;
      border-left: none;
    }
  `}
  ${({ $arrow }) => $arrow === "right" && `
    &::before {
      content: "";
      position: absolute;
      right: -9px; top: 50%; transform: translateY(-50%);
      border: 9px solid transparent;
      border-left-color: #ddd;
      border-right: none;
    }
    &::after {
      content: "";
      position: absolute;
      right: -7px; top: 50%; transform: translateY(-50%);
      border: 8px solid transparent;
      border-left-color: white;
      border-right: none;
    }
  `}
  ${({ $arrow }) => $arrow === "top" && `
    &::before {
      content: "";
      position: absolute;
      top: -9px; left: 50%; transform: translateX(-50%);
      border: 9px solid transparent;
      border-bottom-color: #ddd;
      border-top: none;
    }
    &::after {
      content: "";
      position: absolute;
      top: -7px; left: 50%; transform: translateX(-50%);
      border: 8px solid transparent;
      border-bottom-color: white;
      border-top: none;
    }
  `}
  ${({ $arrow }) => $arrow === "bottom" && `
    &::before {
      content: "";
      position: absolute;
      bottom: -9px; left: 50%; transform: translateX(-50%);
      border: 9px solid transparent;
      border-top-color: #ddd;
      border-bottom: none;
    }
    &::after {
      content: "";
      position: absolute;
      bottom: -7px; left: 50%; transform: translateX(-50%);
      border: 8px solid transparent;
      border-top-color: white;
      border-bottom: none;
    }
  `}
`

export const WinOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 20;
`

export const WinCard = styled.div`
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
  animation: ${fadeUp} 0.35s ease;
`


export const WinHeading = styled.div`
  font-size: 22px;
  font-weight: 300;
  color: ${T.navy};
  letter-spacing: 0.5px;
  margin-bottom: 20px;
`

export const WinStars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
`

export const WinStar = styled.span<{ $filled: boolean }>`
  font-size: 48px;
  color: ${({ $filled }) => ($filled ? T.gold : T.border)};
  display: inline-flex;
  align-items: center;
`

export const WinStatsBox = styled.div`
  width: 100%;
  background: ${T.bg};
  border-radius: 12px;
  padding: 12px 20px 14px;
  text-align: center;
  margin-bottom: 10px;
`

export const WinStatsLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${T.muted};
  margin-bottom: 6px;
`

export const WinStatsTime = styled.div<{ $color: string }>`
  font-size: 26px;
  font-weight: 300;
  color: ${({ $color }) => $color};
`

export const WinRecord = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-bottom: 20px;
`

export const WinButtons = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`

export const WinBtnSecondary = styled.button`
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
  &:active { opacity: 0.7; }
`

export const WinBtnPrimary = styled.button`
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
  &:active { opacity: 0.85; }
`

export const WinBtnIcon = styled.div<{ $light?: boolean }>`
  font-size: 18px;
  color: ${({ $light }) => ($light ? "#fff" : T.navy)};
  opacity: ${({ $light }) => ($light ? 1 : 0.6)};
`

export const WinBtnLabel = styled.div<{ $light?: boolean }>`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${({ $light }) => ($light ? "#fff" : T.muted)};
`

export const LoadingWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${T.muted};
  font-size: 13px;
  letter-spacing: 1px;
`
