import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
`;

export const BallList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BallContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BallHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BallPreview = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.2);
`;

export const BallId = styled.span`
  font-size: 13px;
  font-family: monospace;
  color: #374151;
`;

export const Empty = styled.span`
  font-size: 11px;
  color: #d1d5db;
  font-family: monospace;
`;
