import styled from "styled-components/native"
import { Dimensions } from "react-native"
import { T } from "theme"

const { width: W } = Dimensions.get("window")

export const Screen = styled.View`
  flex: 1;
  background-color: ${T.bg};
  align-items: center;
  justify-content: center;
  padding-horizontal: 40px;
`

export const LogoWrap = styled.View`
  width: ${Math.min(W * 0.66, 220)}px;
  height: ${Math.min(W * 0.66, 220)}px;
  margin-bottom: 20px;
`

export const AppName = styled.Text`
  font-size: 34px;
  font-weight: 300;
  color: ${T.navy};
  letter-spacing: 8px;
  text-align: center;
  margin-bottom: 6px;
`

export const Underline = styled.View`
  width: 108px;
  height: 2.5px;
  border-radius: 2px;
  background-color: ${T.red};
  margin-bottom: 10px;
`

export const Tagline = styled.Text`
  font-size: 11px;
  color: ${T.muted};
  letter-spacing: 3px;
  text-align: center;
  margin-bottom: 36px;
`

export const ButtonGroup = styled.View`
  width: 100%;
  max-width: 280px;
  gap: 12px;
`

export const Progress = styled.Text`
  position: absolute;
  bottom: 40px;
  font-size: 11px;
  color: ${T.muted};
  letter-spacing: 1px;
`
