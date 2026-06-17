import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const LineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LineLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #374151;
`;

export const LineId = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Anchors = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AnchorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

export const Empty = styled.span`
  font-size: 10px;
  color: #d1d5db;
`;
