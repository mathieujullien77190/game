import styled from "styled-components"

export const Group = styled.div<{ $wrap: boolean; $equal: boolean }>`
  display: flex;
  gap: 4px;
  ${(p) => p.$wrap && "flex-wrap: wrap;"}
  ${(p) => p.$equal && "& > * { flex: 1; }"}
`
