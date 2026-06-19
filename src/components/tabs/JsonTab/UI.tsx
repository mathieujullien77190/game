import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
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

export const ButtonRow = styled.div`
  display: flex;
  gap: 6px;
  padding: 6px 8px;
  border-top: 1px solid #e5e7eb;
  background: #fff;
  flex-shrink: 0;
`;

export const ActionButton = styled.button<{ $variant?: "danger" | "primary" | "neutral" }>`
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  cursor: pointer;
  border: 1px solid ${({ $variant }) =>
    $variant === "danger" ? "#ef4444" :
    $variant === "primary" ? "#3b82f6" :
    "#e5e7eb"};
  background: transparent;
  color: ${({ $variant }) =>
    $variant === "danger" ? "#ef4444" :
    $variant === "primary" ? "#3b82f6" :
    "#6b7280"};

  &:hover {
    background: ${({ $variant }) =>
      $variant === "danger" ? "#fef2f2" :
      $variant === "primary" ? "#eff6ff" :
      "#f9fafb"};
  }
`;
