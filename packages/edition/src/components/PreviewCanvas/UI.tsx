import styled from "styled-components"

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
