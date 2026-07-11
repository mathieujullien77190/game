import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const GateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
`

export const GateId = styled.span`
  font-family: monospace;
  font-size: 12px;
  font-weight: bold;
  color: #1a237e;
`

export const NoOptions = styled.span`
  font-family: monospace;
  font-size: 10px;
  color: #bbb;
  font-style: italic;
`
