import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  overflow-y: auto;
`;

export const Empty = styled.p`
  font-size: 12px;
  color: #9ca3af;
`;

export const LinkList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const LinkItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  font-family: monospace;
`;

export const LinkId = styled.span`
  color: #6b7280;
  flex-shrink: 0;
`;

export const LinkDesc = styled.span`
  color: #374151;
`;
