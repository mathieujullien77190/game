import styled from "styled-components/native"
import { T } from "theme"

export const Screen = styled.View`
  flex: 1;
  background-color: ${T.bg};
`

export const List = styled.ScrollView.attrs({ contentContainerStyle: { padding: 16, gap: 10 } })``

export const Footer = styled.View`
  padding: 24px;
  align-items: center;
  gap: 6px;
`

export const FooterLogo = styled.Text`
  font-size: 11px;
  color: ${T.muted};
  letter-spacing: 1px;
`
