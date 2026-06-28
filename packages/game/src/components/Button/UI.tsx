import styled from "styled-components"
import { T } from "theme"

export const Btn = styled.button<{ $variant: "primary" | "secondary" }>`
  width: 100%;
  cursor: pointer;
  border-radius: 14px;
  letter-spacing: 2px;
  &:active {
    opacity: 0.85;
  }

  height: ${({ $variant }) => ($variant === "primary" ? "54px" : "48px")};
  background: ${({ $variant }) => ($variant === "primary" ? T.red : T.surface)};
  color: ${({ $variant }) => ($variant === "primary" ? "#fff" : T.navy)};
  font-size: ${({ $variant }) => ($variant === "primary" ? "14px" : "13px")};
  font-weight: ${({ $variant }) => ($variant === "primary" ? "700" : "500")};
  border: ${({ $variant }) => ($variant === "primary" ? "none" : `1.5px solid ${T.border}`)};
`
