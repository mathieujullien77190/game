import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const LineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const LinkCount = styled.button<{ $active?: boolean }>`
  padding: 0px 6px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.$active ? "#333" : "#e0e0e0")};
  color: ${(p) => (p.$active ? "#fff" : "#888")};
  font-family: monospace;
  font-size: 9px;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: ${(p) => (p.$active ? "#444" : "#d0d0d0")};
  }
`

export const LinkItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px 3px 20px;
  background: #efefef;
  border-left: 2px solid #ccc;
  border-radius: 0 3px 3px 0;
  font-family: monospace;
  font-size: 10px;
`

export const LinkId = styled.span`
  color: #888;
  min-width: 40px;
`

export const LinkDetail = styled.span`
  color: #555;
  flex: 1;
`

export const TypeBadge = styled.span<{ $type: string }>`
  padding: 1px 5px;
  border-radius: 3px;
  background: ${({ $type }) => $type === "curve" ? "#ede7f6" : $type === "sine" ? "#e8f5e9" : "#e8f0fe"};
  color: ${({ $type }) => $type === "curve" ? "#7b1fa2" : $type === "sine" ? "#2e7d32" : "#1565c0"};
  font-family: monospace;
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`

export const BoostRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const BoostLabel = styled.span`
  font-family: monospace;
  font-size: 9px;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 62px;
  flex-shrink: 0;
`

export const LinkActivated = styled.button<{ $on: boolean }>`
  padding: 1px 6px;
  border-radius: 3px;
  border: 1px solid ${({ $on }) => ($on ? "#34a853" : "#ccc")};
  background: ${({ $on }) => ($on ? "#e6f4ea" : "#f5f5f5")};
  color: ${({ $on }) => ($on ? "#34a853" : "#aaa")};
  font-family: monospace;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: ${({ $on }) => ($on ? "#d4edda" : "#ebebeb")};
  }
`
