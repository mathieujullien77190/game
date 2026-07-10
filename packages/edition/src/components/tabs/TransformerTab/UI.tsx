import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const TransformerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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
