import styled from "styled-components";

export const Root = styled.button<{ $color: string }>`
  flex: 1;
  padding: 10px;
  background: ${({ $color }) => $color};
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  font-family: monospace;
  cursor: pointer;

  &:hover { opacity: 0.88; }
`;
