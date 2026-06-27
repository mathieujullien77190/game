import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const TypeRow = styled.div`
  display: flex;
  gap: 4px;
`

export const TypeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 4px 6px;
  font-size: 11px;
  font-family: monospace;
  background: ${({ $active }) => ($active ? "#1565c0" : "#f0f0f0")};
  color: ${({ $active }) => ($active ? "#fff" : "#555")};
  border: 1px solid ${({ $active }) => ($active ? "#1565c0" : "#ccc")};
  border-radius: 3px;
  cursor: pointer;
`

export const AddButton = styled.button<{ $active: boolean }>`
  padding: 6px 10px;
  font-size: 11px;
  font-family: monospace;
  background: ${({ $active }) => ($active ? "#2e7d32" : "#f5f5f5")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  border: 1px solid ${({ $active }) => ($active ? "#2e7d32" : "#ddd")};
  border-radius: 4px;
  cursor: pointer;
`

export const TransformerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const TransformerCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #fafafa;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const TransformerId = styled.span`
  font-family: monospace;
  font-size: 11px;
  color: #2e7d32;
  flex: 1;
`

export const Label = styled.span`
  font-family: monospace;
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
  width: 42px;
  flex-shrink: 0;
`

export const TypeButtons = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`

export const TypeBtn = styled.button<{ $active: boolean }>`
  padding: 3px 8px;
  font-size: 11px;
  font-family: monospace;
  background: ${({ $active }) => ($active ? "#2e7d32" : "#f0f0f0")};
  color: ${({ $active }) => ($active ? "#fff" : "#555")};
  border: 1px solid ${({ $active }) => ($active ? "#2e7d32" : "#ccc")};
  border-radius: 3px;
  cursor: pointer;
`

export const AmountInput = styled.input`
  width: 60px;
  font-size: 11px;
  font-family: monospace;
  padding: 2px 4px;
  border: 1px solid #ccc;
  border-radius: 3px;
`

export const DeleteButton = styled.button`
  font-size: 10px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  &:hover { color: #e53935; }
`
