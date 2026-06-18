import styled from "styled-components";

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fb;
`;

export const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid #d0d4dc;
  background: #ffffff;
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? "#2563eb" : "transparent")};
  color: ${({ $active }) => ($active ? "#2563eb" : "#6b7280")};
  font-size: 14px;
  font-weight: 500;
  font-family: monospace;
  cursor: pointer;

  &:hover {
    color: #2563eb;
  }
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
