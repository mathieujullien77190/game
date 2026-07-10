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

export const ArrivalCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  font-family: monospace;
  font-size: 10px;
  font-weight: bold;
  color: #555;
`

export const AddDemandButton = styled.button`
  width: 100%;
  padding: 6px;
  background: transparent;
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  font-family: monospace;
  font-size: 10px;
  color: #888;
  &:hover { border-color: #888; color: #333; }
`

export const DemandList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const DemandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`
