import styled from "styled-components/native"
import { T } from "theme"

export const Screen = styled.View`
  flex: 1;
  background-color: ${T.bg};
`

export const Body = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px;
`

export const AppName = styled.Text`
  font-size: 26px;
  font-weight: 300;
  letter-spacing: 6px;
  color: ${T.navy};
`

export const Sub = styled.Text`
  font-size: 12px;
  color: ${T.muted};
  text-align: center;
  line-height: 22px;
`

export const Line = styled.View`
  width: 60px;
  height: 2px;
  background-color: ${T.red};
  border-radius: 1px;
  margin-vertical: 6px;
`
