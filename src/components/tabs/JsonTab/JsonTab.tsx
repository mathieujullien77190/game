import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import * as S from "./UI"

export const JsonTab = () => {
  const { editorManager, tokens, start, revision } = useStore(
    useShallow((s) => ({ editorManager: s.editorManager, tokens: s.tokens, start: s.start, revision: s.revision }))
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
      tokens: Object.values(tokens).map((t) => ({
        id: t.id,
        color: t.color,
        type: t.type,
        speed: t.speed,
      })),
      start: start ? { lineId: start.lineId, endpoint: start.endpoint, delay: start.delay } : null,
    },
    null,
    2
  )

  return <S.Pre key={revision}>{json}</S.Pre>
}
