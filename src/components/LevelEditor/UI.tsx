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
  font-family: monospace;
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
  overflow: hidden;
`

export const CanvasOuter = styled.div`
  position: relative;
`

export const RestartButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  background: rgba(255,255,255,0.85);
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-family: monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  z-index: 10;

  &:hover {
    background: #e0e0e0;
  }
`

export const PauseButton = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 10px;
  background: ${({ $active }) => $active ? "#333" : "rgba(255,255,255,0.85)"};
  color: ${({ $active }) => $active ? "#fff" : "#333"};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-family: monospace;
  font-size: 10px;
  z-index: 10;

  &:hover {
    background: #e0e0e0;
    color: #333;
  }
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
  font-family: monospace;
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
  font-family: monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  z-index: 10;

  &:hover {
    background: ${({ $active }) => ($active ? "#444" : "#e0e0e0")};
  }
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

export const StyledCanvas = styled.canvas<{ $scale: number; $cursor: string; $visible: boolean; $w: number; $h: number }>`
  display: ${({ $visible }) => ($visible ? "block" : "none")};
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ $w, $scale }) => $w * $scale}px;
  height: ${({ $h, $scale }) => $h * $scale}px;
  background: #fff;
  cursor: ${({ $cursor }) => $cursor};
  will-change: transform;
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

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  pointer-events: all;
  z-index: 100;
`
