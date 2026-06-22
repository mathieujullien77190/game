import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import * as S from "./UI"

export const LineTab = () => {
  const { editorManager, revision, mode, setMode, removeLine, toggleLinkActivated } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      revision: s.revision,
      mode: s.mode,
      setMode: s.setMode,
      removeLine: s.removeLine,
      toggleLinkActivated: s.toggleLinkActivated,
    }))
  )

  const allLinks = Object.values(editorManager.data.links)

  return (
    <S.Container>
      <S.AddButton
        $active={mode === "addLine"}
        onClick={() => setMode(mode === "addLine" ? "select" : "addLine")}
      >
        {mode === "addLine" ? "Cancel" : "+ Add Line"}
      </S.AddButton>
      <S.LineList>
        {Object.values(editorManager.data.lines).map((line) => {
          const lineLinks = allLinks.filter(
            (lk) => lk.line1.lineId === line.id || lk.line2.lineId === line.id
          )
          return (
            <S.LineBlock key={`${line.id}-${revision}`}>
              <S.LineItem>
                <S.LineLabel>
                  <S.LineId>{line.id}</S.LineId>
                  ({line.start.x}, {line.start.y}) → ({line.end.x}, {line.end.y})
                </S.LineLabel>
                <S.DeleteButton onClick={() => removeLine(line.id)}>✕</S.DeleteButton>
              </S.LineItem>
              {lineLinks.map((lk) => {
                const other = lk.line1.lineId === line.id ? lk.line2 : lk.line1
                return (
                  <S.LinkItem key={lk.id}>
                    <S.LinkId>{lk.id}</S.LinkId>
                    <S.LinkDetail>
                      {other.lineId}[{other.endpoint}]
                    </S.LinkDetail>
                    <S.LinkActivated $on={lk.activated} onClick={() => toggleLinkActivated(lk.id)}>
                      {lk.activated ? "on" : "off"}
                    </S.LinkActivated>
                  </S.LinkItem>
                )
              })}
            </S.LineBlock>
          )
        })}
      </S.LineList>
    </S.Container>
  )
}
