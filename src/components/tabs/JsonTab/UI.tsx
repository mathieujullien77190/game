import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
`;

export const Textarea = styled.textarea`
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
