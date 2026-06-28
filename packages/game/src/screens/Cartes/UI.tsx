import styled from "styled-components"
import { T } from "theme"

export const Screen = styled.div`
  width: 100%;
  height: 100%;
  background: ${T.bg};
  display: flex;
  flex-direction: column;
`

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`

export const Section = styled.div`
  margin-bottom: 24px;
`

export const SectionTitle = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: ${T.muted};
  margin-bottom: 10px;
  padding-left: 2px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`
