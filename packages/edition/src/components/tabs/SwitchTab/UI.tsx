import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AddButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  background: ${(p) => (p.$active ? "#7c3aed" : "#f0f0f0")};
  color: ${(p) => (p.$active ? "#fff" : "#333")};
  border: 1px solid ${(p) => (p.$active ? "#7c3aed" : "#ddd")};
  border-radius: 6px;
  cursor: pointer;
  font-family: monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: ${(p) => (p.$active ? "#6d28d9" : "#e8e8e8")};
  }
`

export const SwitchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const SwitchCard = styled.div`
  padding: 8px 10px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-left: 3px solid #7c3aed;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: default;

  &:hover {
    background: #ede9ff;
    border-color: #c4b5fd;
  }
`

export const SwitchId = styled.span`
  font-family: monospace;
  font-size: 12px;
  font-weight: bold;
  color: #3b0764;
`

export const SwitchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Label = styled.span`
  font-family: monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
  white-space: nowrap;
`

export const SwitchInfo = styled.span`
  font-family: monospace;
  font-size: 10px;
  font-weight: bold;
  color: #555;
  flex: 1;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0;
`

export const OutputList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 3px;
`

export const OutputOption = styled.button<{ $active: boolean }>`
  padding: 5px 8px;
  background: ${(p) => (p.$active ? "#7c3aed" : "#fff")};
  color: ${(p) => (p.$active ? "#fff" : "#555")};
  border: 1px solid ${(p) => (p.$active ? "#7c3aed" : "#ddd")};
  border-radius: 4px;
  cursor: pointer;
  font-family: monospace;
  font-size: 10px;
  text-align: left;

  &:hover {
    background: ${(p) => (p.$active ? "#6d28d9" : "#f0eeff")};
    border-color: #7c3aed;
  }
`

export const NoLinks = styled.span`
  font-family: monospace;
  font-size: 10px;
  color: #bbb;
  font-style: italic;
`

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 12px;
  padding: 0 2px;
  line-height: 1;
  margin-left: auto;

  &:hover {
    color: #e53935;
  }
`
