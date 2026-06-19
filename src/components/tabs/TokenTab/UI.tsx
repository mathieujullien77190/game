import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
`;

export const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TokenContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TokenPreview = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.2);
`;

export const TokenId = styled.span`
  font-size: 13px;
  font-family: monospace;
  color: #374151;
`;

export const Empty = styled.span`
  font-size: 11px;
  color: #d1d5db;
  font-family: monospace;
`;

export const ShapeRow = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
`;

export const ShapeTag = styled.button<{ $active: boolean }>`
  font-size: 10px;
  font-family: monospace;
  padding: 2px 7px;
  border-radius: 3px;
  border: 1px solid ${({ $active }) => ($active ? "#1e293b" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#1e293b" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#9ca3af")};
  cursor: pointer;
  user-select: none;
  &:hover { border-color: #9ca3af; }
`;
