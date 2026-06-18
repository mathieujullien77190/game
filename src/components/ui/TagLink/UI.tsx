import styled from "styled-components";

export const Chip = styled.span<{
  $clickable?: boolean;
  $inactive?: boolean;
  $muted?: boolean;
}>`
  font-size: 10px;
  font-family: monospace;
  padding: 1px 5px;
  border-radius: 3px;
  background: ${({ $inactive, $muted }) =>
    $inactive ? "#f3f4f6" : $muted ? "#f9fafb" : "#faf5ff"};
  color: ${({ $inactive, $muted }) =>
    $inactive ? "#9ca3af" : $muted ? "#6b7280" : "#7c3aed"};
  text-decoration: ${({ $inactive }) => ($inactive ? "line-through" : "none")};
  border: 1px solid ${({ $inactive, $muted }) =>
    $inactive ? "#e5e7eb" : $muted ? "#e5e7eb" : "#ddd6fe"};
  align-self: flex-start;
  user-select: none;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover {
    background: ${({ $inactive, $muted }) =>
      $inactive ? "#e5e7eb" : $muted ? "#f3f4f6" : "#ede9fe"};
    border-color: ${({ $inactive, $muted }) =>
      $inactive ? "#9ca3af" : $muted ? "#9ca3af" : "#7c3aed"};
  }
`;
