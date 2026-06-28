import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const MapRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

export const MapChip = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  font-size: 11px;
  font-family: inherit;
  background: ${({ $active }) => ($active ? "#333" : "#f0f0f0")};
  color: ${({ $active }) => ($active ? "#fff" : "#555")};
  border: 1px solid ${({ $active }) => ($active ? "#333" : "#ddd")};
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: ${({ $active }) => ($active ? "#444" : "#e0e0e0")}; }
`

export const AddMapButton = styled.button`
  padding: 4px 10px;
  font-size: 13px;
  font-family: inherit;
  background: #f0f4ff;
  color: #1565c0;
  border: 1px solid #90caf9;
  border-radius: 4px;
  cursor: pointer;
  line-height: 1;
  &:hover { background: #1565c0; color: #fff; }
`

export const DiffRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

export const DiffChip = styled.button<{ $active: boolean }>`
  padding: 3px 8px;
  font-size: 10px;
  font-family: inherit;
  background: ${({ $active }) => ($active ? "#1565c0" : "#f0f0f0")};
  color: ${({ $active }) => ($active ? "#fff" : "#555")};
  border: 1px solid ${({ $active }) => ($active ? "#1565c0" : "#ddd")};
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: ${({ $active }) => ($active ? "#1976d2" : "#e0e0e0")}; }
`

export const StarRow = styled.div`
  display: flex;
  gap: 8px;
`

export const StarField = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`

export const StarLabel = styled.span`
  font-size: 11px;
  color: #f5a623;
  white-space: nowrap;
`

export const StarInput = styled.input`
  width: 100%;
  padding: 4px 6px;
  font-size: 11px;
  font-family: inherit;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: right;
  &:focus { outline: none; border-color: #999; }
`

export const StarUnit = styled.span`
  font-size: 11px;
  color: #888;
`

export const ButtonRow = styled.div`
  display: flex;
  gap: 6px;
`

export const ClearButton = styled.button`
  padding: 6px 10px;
  font-size: 11px;
  font-family: inherit;
  background: #fff0f0;
  color: #c62828;
  border: 1px solid #ef9a9a;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #c62828; color: #fff; }
`

export const SaveButton = styled.button`
  padding: 6px 10px;
  font-size: 11px;
  font-family: inherit;
  background: #f0fff4;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #2e7d32; color: #fff; }
`

export const CopyButton = styled.button`
  padding: 6px 10px;
  font-size: 11px;
  font-family: inherit;
  background: #f0f4ff;
  color: #1565c0;
  border: 1px solid #90caf9;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #1565c0; color: #fff; }
`

export const Pre = styled.pre`
  margin: 0;
  font-family: inherit;
  font-size: 11px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-break: break-all;
`
