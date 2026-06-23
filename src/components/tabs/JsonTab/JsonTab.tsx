import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import * as S from "./UI"

export const JsonTab = () => {
  const { editorManager, tokens, starts, revision } = useStore(
    useShallow((s) => ({ editorManager: s.editorManager, tokens: s.tokens, starts: s.starts, revision: s.revision }))
  )

  const json = JSON.stringify(
    {
      lines: Object.values(editorManager.data.lines).map((l) => ({ id: l.id, start: l.start, end: l.end })),
      links: Object.values(editorManager.data.links).map((lk) => ({
        id: lk.id,
        line1: lk.line1,
        line2: lk.line2,
        activated: lk.activated,
      })),
      tokens: Object.values(tokens).map((t) => ({ id: t.id, color: t.color, type: t.type, speed: t.speed })),
      starts: Object.values(starts).map((s) => ({ id: s.id, lineId: s.lineId, endpoint: s.endpoint, delay: s.delay })),
    },
    null,
    2
  )

  return <S.Pre key={revision}>{json}</S.Pre>
}
