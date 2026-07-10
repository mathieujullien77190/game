import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const SwitchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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

export const NoLinks = styled.span`
  font-family: monospace;
  font-size: 10px;
  color: #bbb;
  font-style: italic;
`

