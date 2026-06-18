import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
`;

export const StartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StartInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StartId = styled.span`
  font-size: 13px;
  font-family: monospace;
  color: #374151;
`;

export const Empty = styled.span`
  font-size: 11px;
  color: #d1d5db;
  font-family: monospace;
`;
