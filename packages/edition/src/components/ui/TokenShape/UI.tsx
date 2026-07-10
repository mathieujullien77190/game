import styled from "styled-components"

export const StyledTokenShape = styled.div<{ $color: string; $round: boolean; $size: number }>`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  background: ${(p) => p.$color};
  border-radius: ${(p) => (p.$round ? "50%" : "2px")};
  flex-shrink: 0;
`
