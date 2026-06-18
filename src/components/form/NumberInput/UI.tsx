import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Input = styled.input`
  width: 56px;
  font-size: 10px;
  font-family: monospace;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  padding: 1px 4px;
  outline: none;

  &:focus { border-color: #9ca3af; }
`;

export const Unit = styled.span`
  font-size: 10px;
  color: #6b7280;
  font-family: monospace;
`;
