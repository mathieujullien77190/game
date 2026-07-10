import styled, { css } from "styled-components"

const SIZES = {
  sm: css`
    padding: 4px 6px;
    font-size: 10px;
    border-radius: 3px;
  `,
  md: css`
    padding: 6px 10px;
    font-size: 11px;
    border-radius: 4px;
  `,
}

export const StyledButton = styled.button<{ $active: boolean; $accent: string; $full: boolean; $size: "sm" | "md" }>`
  font-family: monospace;
  cursor: pointer;
  border: 1px solid ${(p) => (p.$active ? p.$accent : "#ddd")};
  background: ${(p) => (p.$active ? p.$accent : "#f0f0f0")};
  color: ${(p) => (p.$active ? "#fff" : "#555")};
  ${(p) => SIZES[p.$size]}

  ${(p) => p.$full && css`
    width: 100%;
    padding: 8px 12px;
    font-size: 11px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `}

  &:hover {
    ${(p) => (p.$active ? css`filter: brightness(0.88);` : css`background: #e8e8e8;`)}
  }
`
