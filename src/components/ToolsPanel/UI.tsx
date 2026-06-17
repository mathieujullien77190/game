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

export const JsonWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
`;

export const JsonTextarea = styled.textarea`
  flex: 1;
  width: 100%;
  padding: 10px 12px;
  background: #f8f9fb;
  border: none;
  font-family: monospace;
  font-size: 11px;
  color: #374151;
  resize: none;
  outline: none;
  line-height: 1.5;
`;

export const ClearButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  color: #ef4444;
  cursor: pointer;

  &:hover {
    background: #fef2f2;
    border-color: #ef4444;
  }
`;
