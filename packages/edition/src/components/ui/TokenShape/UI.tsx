import styled, { css } from "styled-components"

const SHAPES: Record<string, ReturnType<typeof css>> = {
  round: css`border-radius: 50%;`,
  square: css`border-radius: 2px;`,
  triangle: css`clip-path: polygon(50% 0%, 0% 100%, 100% 100%);`,
}

export const StyledTokenShape = styled.div<{ $color: string; $shape: string; $size: number }>`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  background: ${(p) => p.$color};
  flex-shrink: 0;
  ${(p) => SHAPES[p.$shape] ?? SHAPES.square}
`
