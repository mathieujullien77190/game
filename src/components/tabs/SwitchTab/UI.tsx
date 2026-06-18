import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
`;

export const SwitchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SwitchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SwitchId = styled.span`
  font-size: 13px;
  font-family: monospace;
  color: #374151;
`;

export const Empty = styled.span`
  font-size: 11px;
  color: #d1d5db;
  font-family: monospace;
`;

export const InputLineSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;
`;

export const InputLineLabel = styled.span`
  font-size: 10px;
  font-family: monospace;
  color: #9ca3af;
  text-transform: uppercase;
`;

export const InputLineOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

export const InputLineOption = styled.button<{ $active: boolean }>`
  padding: 2px 8px;
  border-radius: 3px;
  border: 1px solid ${({ $active }) => ($active ? "#374151" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#374151" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#6b7280")};
  font-size: 10px;
  font-family: monospace;
  cursor: pointer;
  &:hover {
    border-color: #9ca3af;
  }
`;

export const LinkOption = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 4px 8px;
  border: 1px solid ${({ $active }) => ($active ? "#374151" : "#e5e7eb")};
  border-radius: 4px;
  background: ${({ $active }) => ($active ? "#f3f4f6" : "transparent")};
  cursor: pointer;
  text-align: left;
  width: 100%;
  &:hover {
    border-color: #9ca3af;
  }
`;

export const LinkDot = styled.span<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#374151" : "#d1d5db")};
  flex-shrink: 0;
  margin-top: 3px;
`;

export const LinkContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const LinkId = styled.span`
  font-size: 11px;
  font-family: monospace;
  color: #374151;
  font-weight: 600;
`;

export const LinkRefs = styled.span`
  font-size: 10px;
  font-family: monospace;
  color: #6b7280;
`;
