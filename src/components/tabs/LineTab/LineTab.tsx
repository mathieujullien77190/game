import { useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import * as S from "./UI"

export const LineTab = () => {
  const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) =>
    setExpandedLines((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const { editorManager, revision, mode, lineType, setMode, setLineType, removeLine, toggleLinkActivated, setHoveredLineId } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      revision: s.revision,
      mode: s.mode,
      lineType: s.lineType,
      setMode: s.setMode,
      setLineType: s.setLineType,
      removeLine: s.removeLine,
      toggleLinkActivated: s.toggleLinkActivated,
      setHoveredLineId: s.setHoveredLineId,
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
            <S.LineBlock key={`${line.id}-${revision}`} onMouseEnter={() => setHoveredLineId(line.id)} onMouseLeave={() => setHoveredLineId(null)}>
              <S.LineItem>
                <S.LineLabel onClick={() => lineLinks.length > 0 && toggleExpand(line.id)} $clickable={lineLinks.length > 0}>
                  {lineLinks.length > 0 && (
                    <S.Chevron $open={expandedLines.has(line.id)}>▶</S.Chevron>
                  )}
                  <S.LineId>{line.id}</S.LineId>
                  <S.TypeBadge $curve={line.type === "curve"}>{line.type}</S.TypeBadge>
                  {lineLinks.length > 0 && !expandedLines.has(line.id) && (
                    <S.LinkCount>{lineLinks.length}</S.LinkCount>
                  )}
                </S.LineLabel>
                <S.DeleteButton onClick={() => removeLine(line.id)}>✕</S.DeleteButton>
              </S.LineItem>
              {expandedLines.has(line.id) && lineLinks.map((lk) => {
                const other = lk.line1.lineId === line.id ? lk.line2 : lk.line1
                return (
                  <S.LinkItem key={lk.id}>
                    <S.LinkId>{lk.id}</S.LinkId>
                    <S.LinkDetail>{other.lineId}[{other.endpoint}]</S.LinkDetail>
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
