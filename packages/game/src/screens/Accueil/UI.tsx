import styled from "styled-components"
import { T } from "theme"

export const Screen = styled.div`
  width: 100%;
  height: 100%;
  background: ${T.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 0 40px;
  position: relative;
`

export const LogoWrap = styled.div`
  width: 66vw;
  max-width: 220px;
  aspect-ratio: 1 / 1;
  margin-bottom: 20px;
`

export const AppName = styled.div`
  font-size: 34px;
  font-weight: 300;
  color: ${T.navy};
  letter-spacing: 8px;
  text-align: center;
  margin-bottom: 6px;
`

export const Underline = styled.div`
  width: 108px;
  height: 2.5px;
  border-radius: 2px;
  background: ${T.red};
  margin: 0 auto 10px;
`

export const Tagline = styled.div`
  font-size: 11px;
  color: ${T.muted};
  letter-spacing: 3px;
  text-align: center;
  margin-bottom: 36px;
`

export const ButtonGroup = styled.div`
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Progress = styled.div`
  position: absolute;
  bottom: 40px;
  font-size: 11px;
  color: ${T.muted};
  letter-spacing: 1px;
`
