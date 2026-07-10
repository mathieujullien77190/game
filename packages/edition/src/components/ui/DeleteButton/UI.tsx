import styled from "styled-components"

export const StyledDeleteButton = styled.button<{ $size: number }>`
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: ${(p) => p.$size}px;
  padding: 0 2px;
  line-height: 1;

  &:hover {
    color: #e53935;
  }
`
