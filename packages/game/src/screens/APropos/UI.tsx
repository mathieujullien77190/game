import styled from "styled-components"
import { T } from "theme"

export const Screen = styled.div`
  width: 100%;
  height: 100%;
  background: ${T.bg};
  display: flex;
  flex-direction: column;
`

export const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px;
`

export const AppName = styled.div`
  font-size: 26px;
  font-weight: 300;
  letter-spacing: 6px;
  color: ${T.navy};
`

export const Sub = styled.div`
  font-size: 12px;
  color: ${T.muted};
  text-align: center;
  line-height: 1.8;
`

export const Line = styled.div`
  width: 60px;
  height: 2px;
  background: ${T.red};
  border-radius: 1px;
  margin: 6px 0;
`
