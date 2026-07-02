import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AddButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  background: ${(p) => (p.$active ? "#1a237e" : "#f0f0f0")};
  color: ${(p) => (p.$active ? "#fff" : "#333")};
  border: 1px solid ${(p) => (p.$active ? "#1a237e" : "#ddd")};
  border-radius: 6px;
  cursor: pointer;
  font-family: monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: ${(p) => (p.$active ? "#283593" : "#e8e8e8")};
  }
`

export const GateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const GateCard = styled.div`
  padding: 8px 10px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-left: 3px solid #3f51b5;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: default;

  &:hover {
    background: #e8eaf6;
  }
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

export const Label = styled.div`
  font-family: monospace;
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`

export const Select = styled.select`
  width: 100%;
  padding: 4px 6px;
  font-family: monospace;
  font-size: 11px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #333;
`

export const ScreensSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
`

export const ScreenTimeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
`

export const MultiplierInput = styled.input`
  width: 60px;
  padding: 3px 6px;
  font-family: monospace;
  font-size: 11px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #333;
  text-align: right;
`
