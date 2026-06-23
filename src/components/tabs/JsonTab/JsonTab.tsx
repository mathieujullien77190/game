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

  const json = JSON.stringify(serializeMap(editorManager, tokens, starts, switches, switchLinks), null, 2)

  return <S.Pre key={revision}>{json}</S.Pre>
}
