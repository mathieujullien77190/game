import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f0f0f0;
`

export const LeftPanel = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #e8e8e8;
  overflow: hidden;
`

export const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  flex-shrink: 0;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
`

export const ViewButton = styled.button<{ $active: boolean }>`
  padding: 5px 14px;
  background: ${({ $active }) => ($active ? "#333" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#666")};
  border: 1px solid ${({ $active }) => ($active ? "#333" : "#ccc")};
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;

  &:hover {
    background: ${({ $active }) => ($active ? "#333" : "#e0e0e0")};
  }
`

export const CanvasArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
`

export const CanvasOuter = styled.div`
  position: relative;
`


export const ScreenBar = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
  z-index: 10;
`

export const ScreenBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: ${({ $active }) => ($active ? "#333" : "rgba(255,255,255,0.85)")};
  color: ${({ $active }) => ($active ? "#fff" : "#666")};
  border: 1px solid ${({ $active }) => ($active ? "#333" : "#ccc")};
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  letter-spacing: 0.6px;
  &:hover { background: ${({ $active }) => ($active ? "#444" : "#e0e0e0")}; }
`

export const ScreenClose = styled.span`
  font-size: 12px;
  line-height: 1;
  opacity: 0.6;
  &:hover { opacity: 1; }
`

export const IdsButton = styled.button<{ $active: boolean }>`
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 10px;
  background: ${({ $active }) => ($active ? "#333" : "rgba(255,255,255,0.85)")};
  color: ${({ $active }) => ($active ? "#fff" : "#666")};
  border: 1px solid ${({ $active }) => ($active ? "#333" : "#ccc")};
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  z-index: 10;

  &:hover {
    background: ${({ $active }) => ($active ? "#444" : "#e0e0e0")};
  }
`

export const HelpLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
`

export const HelpBox = styled.div<{ $x: number; $y: number; $arrow: string; $selected: boolean }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  background: white;
  border: 2px solid ${({ $selected }) => ($selected ? "#3A6FD8" : "#ddd")};
  border-radius: 5px;
  padding: 10px 14px;
  font-size: 13px;
  color: #333;
  max-width: 180px;
  min-width: 80px;
  word-wrap: break-word;
  white-space: pre-wrap;
  pointer-events: all;
  cursor: grab;
  user-select: none;

  ${({ $arrow }) => $arrow === "left" && `
    &::before { content:""; position:absolute; left:-9px; top:50%; transform:translateY(-50%); border:9px solid transparent; border-right-color:#ddd; border-left:none; }
    &::after  { content:""; position:absolute; left:-7px; top:50%; transform:translateY(-50%); border:8px solid transparent; border-right-color:white; border-left:none; }
  `}
  ${({ $arrow }) => $arrow === "right" && `
    &::before { content:""; position:absolute; right:-9px; top:50%; transform:translateY(-50%); border:9px solid transparent; border-left-color:#ddd; border-right:none; }
    &::after  { content:""; position:absolute; right:-7px; top:50%; transform:translateY(-50%); border:8px solid transparent; border-left-color:white; border-right:none; }
  `}
  ${({ $arrow }) => $arrow === "top" && `
    &::before { content:""; position:absolute; top:-9px; left:50%; transform:translateX(-50%); border:9px solid transparent; border-bottom-color:#ddd; border-top:none; }
    &::after  { content:""; position:absolute; top:-7px; left:50%; transform:translateX(-50%); border:8px solid transparent; border-bottom-color:white; border-top:none; }
  `}
  ${({ $arrow }) => $arrow === "bottom" && `
    &::before { content:""; position:absolute; bottom:-9px; left:50%; transform:translateX(-50%); border:9px solid transparent; border-top-color:#ddd; border-bottom:none; }
    &::after  { content:""; position:absolute; bottom:-7px; left:50%; transform:translateX(-50%); border:8px solid transparent; border-top-color:white; border-bottom:none; }
  `}
`

export const CanvasWrapper = styled.div<{ $w: number; $h: number }>`
  position: relative;
  width: ${({ $w }) => $w}px;
  height: ${({ $h }) => $h}px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
`

export const Divider = styled.div`
  width: 4px;
  flex-shrink: 0;
  cursor: col-resize;
  background: #d0d0d0;
  user-select: none;

  &:hover {
    background: #aaa;
  }
`

export const RightArea = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  position: relative;
`

export const RightPanel = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  overflow: hidden;
`

export const SaveButton = styled.button`
  margin-left: auto;
  padding: 5px 14px;
  background: #2a7d4f;
  color: #fff;
  border: 1px solid #236641;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;

  &:hover { background: #236641; }
  &:active { background: #1a4d31; }
`

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  pointer-events: all;
  z-index: 100;
`
