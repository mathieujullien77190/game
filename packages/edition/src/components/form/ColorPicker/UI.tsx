import styled from "styled-components"

export const Palette = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

export const Swatch = styled.button<{ $color: string; $selected: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $selected }) => ($selected ? "#fff" : "transparent")};
  outline: 2px solid ${({ $selected, $color }) => ($selected ? $color : "transparent")};
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.2);
  }
`

export const NoneSwatch = styled.button<{ $selected: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  background-image: linear-gradient(45deg, transparent 46%, #e53935 46%, #e53935 54%, transparent 54%);
  border: 2px solid ${({ $selected }) => ($selected ? "#333" : "#ccc")};
  outline: 2px solid ${({ $selected }) => ($selected ? "#333" : "transparent")};
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.2);
  }
`
