import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { serializeMap } from "store/mapJson"
import * as S from "./UI"

export const JsonTab = () => {
  const { editorManager, tokens, starts, switches, switchLinks, revision } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      tokens: s.tokens,
      starts: s.starts,
      switches: s.switches,
      switchLinks: s.switchLinks,
      revision: s.revision,
    }))
  )

  const { transformers, inverters, arrival, screens, screenGates, screenTimeMultipliers } = useStore(
    useShallow((s) => ({ transformers: s.transformers, inverters: s.inverters, arrival: s.arrival, screens: s.screens, screenGates: s.screenGates, screenTimeMultipliers: s.screenTimeMultipliers }))
  )

  const json = JSON.stringify(serializeMap(editorManager, tokens, starts, switches, switchLinks, transformers, arrival, inverters, screens, screenGates, screenTimeMultipliers), null, 2)

  const handleClear = () => {
    localStorage.removeItem("game2-map")
    window.location.reload()
  }

  return (
    <S.Container>
      <S.ButtonRow>
        <S.ClearButton onClick={handleClear}>Clear map</S.ClearButton>
        <S.CopyButton onClick={() => navigator.clipboard.writeText(json)}>Copy</S.CopyButton>
      </S.ButtonRow>
      <S.Pre key={revision}>{json}</S.Pre>
    </S.Container>
  )
}
