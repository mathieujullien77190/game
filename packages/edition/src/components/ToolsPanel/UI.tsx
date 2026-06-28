import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const TabBar = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
`

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 9px 16px;
  background: transparent;
  color: ${({ $active }) => ($active ? "#1a73e8" : "#888")};
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? "#1a73e8" : "transparent")};
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.8px;

  &:hover {
    color: ${({ $active }) => ($active ? "#1a73e8" : "#444")};
  }
`

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
`
