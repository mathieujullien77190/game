import styled from "styled-components/native"
import { T } from "theme"

export const Wrap = styled.View`
  flex-direction: row;
  align-items: center;
  height: 64px;
  padding-horizontal: 20px;
  background-color: ${T.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${T.border};
`

export const BackBtn = styled.TouchableOpacity`
  padding-right: 12px;
  align-items: center;
  justify-content: center;
`

export const Title = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: ${T.navy};
`

export const Spacer = styled.View`
  width: 40px;
`
