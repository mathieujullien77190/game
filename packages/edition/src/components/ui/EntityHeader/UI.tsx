import styled from "styled-components"

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
`

export const Left = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
  user-select: none;
`

export const Chevron = styled.span<{ $open: boolean }>`
  font-size: 8px;
  color: #aaa;
  flex-shrink: 0;
  transform: ${({ $open }) => ($open ? "rotate(90deg)" : "rotate(0deg)")};
  transition: transform 0.15s ease;
  display: inline-block;
`
