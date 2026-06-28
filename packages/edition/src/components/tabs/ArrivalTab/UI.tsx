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
  font-family: inherit;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  &:hover { background: ${(p) => (p.$active ? "#555" : "#e8e8e8")}; }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
`

export const Info = styled.span`
  font-family: inherit;
  font-size: 10px;
  font-weight: bold;
  color: #555;
`

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 12px;
  padding: 0 2px;
  line-height: 1;
  &:hover { color: #e53935; }
`

export const AddDemandButton = styled.button`
  width: 100%;
  padding: 6px;
  background: transparent;
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  color: #888;
  &:hover { border-color: #888; color: #333; }
`

export const DemandList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const DemandCard = styled.div`
  padding: 8px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const DemandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const TypeToggle = styled.button<{ $active?: boolean }>`
  padding: 4px 8px;
  background: ${(p) => (p.$active ? "#333" : "#e8e8e8")};
  color: ${(p) => (p.$active ? "#fff" : "#666")};
  border: 1px solid ${(p) => (p.$active ? "#333" : "#ddd")};
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  &:hover { background: ${(p) => (p.$active ? "#555" : "#ddd")}; }
`

export const RotationRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

export const RotBtn = styled.button<{ $active?: boolean }>`
  padding: 3px 5px;
  background: ${(p) => (p.$active ? "#333" : "#e8e8e8")};
  color: ${(p) => (p.$active ? "#fff" : "#666")};
  border: 1px solid ${(p) => (p.$active ? "#333" : "#ddd")};
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 9px;
  &:hover { background: ${(p) => (p.$active ? "#555" : "#ddd")}; }
`
