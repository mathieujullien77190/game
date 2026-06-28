import styled from "styled-components"

export const Wrap = styled.div`
  position: fixed;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.55);
  color: rgba(255, 255, 255, 0.85);
  font-size: 10px;
  font-family: monospace;
  padding: 3px 10px;
  border-radius: 20px;
  pointer-events: none;
  z-index: 9999;
  white-space: nowrap;
`
