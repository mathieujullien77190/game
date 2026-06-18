import styled from "styled-components";

export const Chip = styled.span<{
  $color: string;
  $bg: string;
  $clickable: boolean;
  $inactive: boolean;
}>`
  font-size: 10px;
  font-family: monospace;
  padding: 1px 5px;
  border-radius: 3px;
  background: ${({ $bg, $inactive }) => ($inactive ? "#f3f4f6" : $bg)};
  color: ${({ $color, $inactive }) => ($inactive ? "#9ca3af" : $color)};
  text-decoration: ${({ $inactive }) => ($inactive ? "line-through" : "none")};
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  border: ${({ $clickable }) => ($clickable ? "1px solid #e5e7eb" : "none")};
  align-self: flex-start;
  user-select: none;

  ${({ $clickable }) => $clickable && "&:hover { border-color: #9ca3af; }"}
`;
