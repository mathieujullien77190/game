import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
`;

export const ScreenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ScreenRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  flex: 1;
  padding: 2px 0;
  color: ${({ $active }) => ($active ? "#6366f1" : "#374151")};
`;

export const ScreenId = styled.span`
  font-size: 13px;
  font-family: monospace;
  font-weight: 600;
`;

export const ScreenHint = styled.span`
  font-size: 10px;
  font-family: monospace;
  opacity: 0.5;
`;

export const Empty = styled.span`
  font-size: 11px;
  color: #d1d5db;
  font-family: monospace;
`;
