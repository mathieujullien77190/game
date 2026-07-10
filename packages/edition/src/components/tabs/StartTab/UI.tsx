import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AddButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  background: ${(p) => (p.$active ? "#333" : "#f0f0f0")};
  color: ${(p) => (p.$active ? "#fff" : "#333")};
  border: 1px solid ${(p) => (p.$active ? "#333" : "#ddd")};
  border-radius: 6px;
  cursor: pointer;
  font-family: monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: ${(p) => (p.$active ? "#555" : "#e8e8e8")};
  }
`

export const StartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const StartCard = styled.div`
  padding: 8px 10px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const StartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const StartInfo = styled.span`
  font-family: monospace;
  font-size: 10px;
  font-weight: bold;
  color: #555;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0;
`

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 12px;
  padding: 0 2px;
  line-height: 1;

  &:hover {
    color: #e53935;
  }
`

export const TokenSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TokenSectionLabel = styled.span`
  font-family: monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
`

export const AddTokenButton = styled.button`
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: #555;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  padding: 0 5px;

  &:hover {
    border-color: #333;
    color: #333;
  }
`

export const TokenCard = styled.div`
  padding: 6px 8px;
  background: #ececec;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`

export const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const TokenShape = styled.div<{ $color: string; $round: boolean }>`
  width: 12px;
  height: 12px;
  background: ${(p) => p.$color};
  border-radius: ${(p) => (p.$round ? "50%" : "2px")};
  flex-shrink: 0;
`

export const TokenId = styled.span`
  font-family: monospace;
  font-size: 10px;
  color: #777;
  flex: 1;
`

export const TypeToggle = styled.div`
  display: flex;
  gap: 3px;
`

export const TypeButton = styled.button<{ $active: boolean }>`
  padding: 2px 6px;
  font-family: monospace;
  font-size: 10px;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid ${(p) => (p.$active ? "#333" : "#ddd")};
  background: ${(p) => (p.$active ? "#333" : "#f5f5f5")};
  color: ${(p) => (p.$active ? "#fff" : "#999")};

  &:hover {
    border-color: #333;
    color: ${(p) => (p.$active ? "#fff" : "#333")};
  }
`
