import styled from "styled-components"
import { T } from "theme"

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
  background: rgba(245, 245, 247, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
`

export const PauseTitle = styled.div`
  font-size: 22px;
  font-weight: 300;
  color: ${T.navy};
  letter-spacing: 2px;
`

export const PauseBtn2 = styled.button`
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

export const LoadingWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${T.muted};
  font-size: 13px;
  letter-spacing: 1px;
`
