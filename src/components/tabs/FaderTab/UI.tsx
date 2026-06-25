import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AddButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  background: ${(p) => (p.$active ? "#546e7a" : "#f0f0f0")};
  color: ${(p) => (p.$active ? "#fff" : "#333")};
  border: 1px solid ${(p) => (p.$active ? "#546e7a" : "#ddd")};
  border-radius: 6px;
  cursor: pointer;
  font-family: monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: ${(p) => (p.$active ? "#455a64" : "#e8e8e8")};
  }
`

export const FaderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FaderCard = styled.div`
  padding: 8px 10px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-left: 3px solid #78909c;
  border-radius: 6px;
  cursor: default;

  &:hover {
    background: #eceff1;
    border-color: #b0bec5;
  }
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const FaderId = styled.span`
  font-family: monospace;
  font-size: 12px;
  font-weight: bold;
  color: #37474f;
`

export const AmountInput = styled.input`
  width: 56px;
  padding: 2px 4px;
  font-family: monospace;
  font-size: 11px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: right;
  color: #37474f;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #78909c;
  }
`

export const AmountLabel = styled.span`
  font-family: monospace;
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 12px;
  padding: 0 2px;
  line-height: 1;

  &:hover {
    color: #e53935;
  }
`
