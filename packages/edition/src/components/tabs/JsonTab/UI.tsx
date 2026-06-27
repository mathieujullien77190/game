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
