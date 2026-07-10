import styled, { css } from "styled-components"

export const Wrap = styled.div<{ $direction: "row" | "column" }>`
  display: flex;
  ${(p) => (p.$direction === "row"
    ? css`
      flex-direction: row;
      align-items: center;
      gap: 8px;
    `
    : css`
      flex-direction: column;
      gap: 4px;
    `)}
`

export const Label = styled.span<{ $direction: "row" | "column" }>`
  font-family: monospace;
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  ${(p) => p.$direction === "row" && css`
    min-width: 50px;
    flex-shrink: 0;
  `}
`
