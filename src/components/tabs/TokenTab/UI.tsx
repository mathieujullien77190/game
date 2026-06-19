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

export const TokenPreview = styled.div<{ $color: string; $shape: "circle" | "square" | "triangle" }>`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background: ${({ $color }) => $color};
  box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  border-radius: ${({ $shape }) => ($shape === "circle" ? "50%" : $shape === "square" ? "3px" : "0")};
  clip-path: ${({ $shape }) =>
    $shape === "triangle"
      ? "polygon(50% 0%, 0% 100%, 100% 100%)"
      : "none"};
`;

export const TokenId = styled.span`
  font-size: 13px;
  font-family: monospace;
  color: #374151;
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0;
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
