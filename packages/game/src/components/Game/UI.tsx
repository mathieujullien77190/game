import styled from "styled-components"

export const Lobby = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`

export const PlayButton = styled.button`
  padding: 16px 48px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 3px;

  &:hover {
    background: #444;
  }
`

export const RestartButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.85);
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  z-index: 10;

  &:hover {
    background: #e0e0e0;
  }
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

export const PauseButton = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 10px;
  background: ${({ $active }) => ($active ? "#333" : "rgba(255,255,255,0.85)")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  z-index: 10;

  &:hover {
    background: #e0e0e0;
    color: #333;
  }
`
