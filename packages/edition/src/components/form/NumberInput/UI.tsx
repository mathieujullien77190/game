import styled from "styled-components"

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`

export const Input = styled.input`
  width: 52px;
  padding: 3px 6px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-family: monospace;
  font-size: 11px;
  background: #fff;
  color: #333;

  &:focus {
    outline: none;
    border-color: #333;
  }
`

export const StepButton = styled.button`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  color: #888;
  font-family: monospace;
  font-size: 9px;
  line-height: 1;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: #333;
    color: #333;
  }

  &:active:not(:disabled) {
    background: #f0f0f0;
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`
