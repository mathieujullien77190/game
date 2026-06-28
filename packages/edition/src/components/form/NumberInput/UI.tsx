import styled from "styled-components"

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Label = styled.span`
  font-family: inherit;
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  min-width: 50px;
`

export const Input = styled.input`
  width: 70px;
  padding: 3px 6px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-family: inherit;
  font-size: 11px;
  background: #fff;
  color: #333;

  &:focus {
    outline: none;
    border-color: #333;
  }
`
