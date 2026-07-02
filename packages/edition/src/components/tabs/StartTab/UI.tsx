import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AddButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  background: ${(p) => (p.$active ? "#333" : "#f0f0f0")};
  color: ${(p) => (p.$active ? "#fff" : "#333")};
  border: 1px solid ${(p) => (p.$active ? "#333" : "#ddd")};
  border-radius: 6px;
  cursor: pointer;
  font-family: monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: ${(p) => (p.$active ? "#555" : "#e8e8e8")};
  }
`

export const StartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const StartCard = styled.div`
  padding: 8px 10px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const StartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const StartInfo = styled.span`
  font-family: monospace;
  font-size: 10px;
  font-weight: bold;
  color: #555;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0;
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
