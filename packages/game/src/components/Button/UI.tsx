import styled from "styled-components/native"
import { T } from "theme"

export const Btn = styled.TouchableOpacity<{ $variant: "primary" | "secondary" }>`
  width: 100%;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  height: ${({ $variant }) => ($variant === "primary" ? "54px" : "48px")};
  background-color: ${({ $variant }) => ($variant === "primary" ? T.red : T.surface)};
  border-width: ${({ $variant }) => ($variant === "primary" ? "0px" : "1.5px")};
  border-color: ${T.border};
`

export const BtnText = styled.Text<{ $variant: "primary" | "secondary" }>`
  color: ${({ $variant }) => ($variant === "primary" ? "#fff" : T.navy)};
  font-size: ${({ $variant }) => ($variant === "primary" ? "14px" : "13px")};
  font-weight: ${({ $variant }) => ($variant === "primary" ? "700" : "500")};
  letter-spacing: 2px;
`
