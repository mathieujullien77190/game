import styled from "styled-components";

export const Chip = styled.span<{
  $clickable?: boolean;
  $inactive?: boolean;
  $large?: boolean;
  $muted?: boolean;
  $selected?: boolean;
}>`
  font-size: ${({ $large }) => ($large ? "13px" : "10px")};
  font-weight: ${({ $large }) => ($large ? "600" : "400")};
  font-family: monospace;
  padding: ${({ $large }) => ($large ? "2px 6px" : "1px 5px")};
  border-radius: 3px;
  background: ${({ $inactive, $muted, $selected }) =>
    $inactive ? "#f3f4f6" : $selected ? "#2563eb" : $muted ? "#f9fafb" : "#eff6ff"};
  color: ${({ $inactive, $muted, $selected }) =>
    $inactive ? "#9ca3af" : $selected ? "#ffffff" : $muted ? "#6b7280" : "#2563eb"};
  text-decoration: ${({ $inactive }) => ($inactive ? "line-through" : "none")};
  border: 1px solid ${({ $inactive, $muted, $selected }) =>
    $inactive ? "#e5e7eb" : $selected ? "#1d4ed8" : $muted ? "#e5e7eb" : "#bfdbfe"};
  align-self: flex-start;
  user-select: none;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover {
    background: ${({ $inactive, $muted, $selected }) =>
      $inactive ? "#e5e7eb" : $selected ? "#1d4ed8" : $muted ? "#f3f4f6" : "#dbeafe"};
    border-color: ${({ $inactive, $muted, $selected }) =>
      $inactive ? "#9ca3af" : $selected ? "#1e40af" : $muted ? "#9ca3af" : "#2563eb"};
  }
`;
