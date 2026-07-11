import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ArrivalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const DemandSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const DemandSectionLabel = styled.span`
  font-family: monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
`

export const AddDemandButton = styled.button`
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

export const DemandList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`
