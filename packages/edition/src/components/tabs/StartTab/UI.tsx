import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const StartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const TokenSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TokenSectionLabel = styled.span`
  font-family: monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
`

export const AddTokenButton = styled.button`
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

