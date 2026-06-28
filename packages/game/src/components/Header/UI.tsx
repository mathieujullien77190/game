import styled from "styled-components"
import { T } from "theme"

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  background: ${T.surface};
  border-bottom: 1px solid ${T.border};
  flex-shrink: 0;
`

export const BackBtn = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: ${T.muted};
  cursor: pointer;
  padding: 0 12px 0 0;
`

export const Title = styled.div`
  flex: 1;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: ${T.navy};
`

export const Spacer = styled.div`
  width: 40px;
`
