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

  const { transformers, inverters, arrival } = useStore(
    useShallow((s) => ({ transformers: s.transformers, inverters: s.inverters, arrival: s.arrival }))
  )

  const json = JSON.stringify(serializeMap(editorManager, tokens, starts, switches, switchLinks, transformers, arrival, inverters), null, 2)

  const handleClear = () => {
    localStorage.removeItem("game2-map")
    window.location.reload()
  }

  return (
    <S.Container>
      <S.ClearButton onClick={handleClear}>Clear map</S.ClearButton>
      <S.Pre key={revision}>{json}</S.Pre>
    </S.Container>
  )
}
