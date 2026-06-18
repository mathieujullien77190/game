import styled from "styled-components";

export const Palette = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

export const Swatch = styled.button<{ $color: string; $selected: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $selected }) => ($selected ? "#1e293b" : "transparent")};
  outline: ${({ $selected }) => ($selected ? "2px solid #ffffff" : "none")};
  outline-offset: -3px;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: transform 0.1s;

  &:hover { transform: scale(1.2); }
`;
