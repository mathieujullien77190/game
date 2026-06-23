import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import * as S from "./UI"

export const LineTab = () => {
  const { editorManager, revision, mode, lineType, setMode, setLineType, removeLine, toggleLinkActivated } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      revision: s.revision,
      mode: s.mode,
      lineType: s.lineType,
      setMode: s.setMode,
      setLineType: s.setLineType,
      removeLine: s.removeLine,
      toggleLinkActivated: s.toggleLinkActivated,
    }))
  )

  const allLinks = Object.values(editorManager.data.links)

  return (
    <S.Container>
      {mode === "addLine" ? (
        <S.AddButton $active onClick={() => setMode("select")}>Cancel</S.AddButton>
      ) : (
        <S.TypeRow>
          <S.TypeButton
            $active={false}
            onClick={() => { setLineType("straight"); setMode("addLine") }}
          >
            + Straight
          </S.TypeButton>
          <S.TypeButton
            $active={false}
            onClick={() => { setLineType("curve"); setMode("addLine") }}
          >
            + Curve
          </S.TypeButton>
        </S.TypeRow>
      )}

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
                  <S.TypeBadge $curve={line.type === "curve"}>{line.type}</S.TypeBadge>
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
