import styled from "styled-components"

export const StyledCard = styled.div<{ $accent?: string; $nested: boolean }>`
  padding: ${(p) => (p.$nested ? "6px 8px" : "8px 10px")};
  background: ${(p) => (p.$nested ? "#ececec" : "#f5f5f5")};
  border: 1px solid ${(p) => (p.$nested ? "#ddd" : "#e0e0e0")};
  border-radius: ${(p) => (p.$nested ? "4px" : "6px")};
  display: flex;
  flex-direction: column;
  gap: ${(p) => (p.$nested ? "5px" : "6px")};
  ${(p) => p.$accent && `border-left: 3px solid ${p.$accent};`}

  &:hover {
    background: ${(p) => (p.$nested ? "#e4e4e4" : "#eee")};
  }
`
