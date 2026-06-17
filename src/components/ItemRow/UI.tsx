import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: background 0.1s;

  &:hover { background: #f0f9ff; }
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 2px 2px 2px 8px;
  flex-shrink: 0;

  &:hover { color: #dc2626; }
`;
