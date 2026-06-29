import styled from "styled-components/native"
import { T } from "theme"

export const Screen = styled.View`
  flex: 1;
  background-color: ${T.bg};
`

export const ScrollArea = styled.ScrollView.attrs({ contentContainerStyle: { padding: 16 } })``

export const Section = styled.View`
  margin-bottom: 24px;
`

export const SectionTitle = styled.Text`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: ${T.muted};
  margin-bottom: 10px;
  padding-left: 2px;
`

export const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`
