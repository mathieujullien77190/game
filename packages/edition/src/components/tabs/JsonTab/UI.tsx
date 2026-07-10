import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ButtonRow = styled.div`
  display: flex;
  gap: 6px;
`

export const MapRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

export const MapButton = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  background: ${({ $active }) => ($active ? "#333" : "#e8e8e8")};
  color: ${({ $active }) => ($active ? "#fff" : "#666")};
  border: 1px solid ${({ $active }) => ($active ? "#333" : "#ddd")};
  border-radius: 4px;
  cursor: pointer;
  font-family: monospace;
  font-size: 11px;
  &:hover { background: ${({ $active }) => ($active ? "#555" : "#ddd")}; }
`

export const NewMapButton = styled.button`
  padding: 6px 10px;
  font-size: 11px;
  font-family: monospace;
  background: #f0fff4;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #2e7d32; color: #fff; }
`

export const ClearButton = styled.button`
  padding: 6px 10px;
  font-size: 11px;
  font-family: monospace;
  background: #fff0f0;
  color: #c62828;
  border: 1px solid #ef9a9a;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #c62828; color: #fff; }
`

export const CopyButton = styled.button`
  padding: 6px 10px;
  font-size: 11px;
  font-family: monospace;
  background: #f0f4ff;
  color: #1565c0;
  border: 1px solid #90caf9;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #1565c0; color: #fff; }
`

export const Pre = styled.pre`
  margin: 0;
  font-family: monospace;
  font-size: 11px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-break: break-all;
`
