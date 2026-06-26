import { useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { NumberInput } from "components/form/NumberInput"
import { MAX_BOOST } from "engine/constants"
import * as S from "./UI"

export const LineTab = () => {
  const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) =>
    setExpandedLines((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const { editorManager, revision, mode, lineType, setMode, setLineType, setLinePreset, removeLine, updateLineBoost, updateLineTunnel, updateLineShowSpeed, updateLineLimitation, updateLineSine, toggleLinkActivated, setHoveredLineId } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      revision: s.revision,
      mode: s.mode,
      lineType: s.lineType,
      setMode: s.setMode,
      setLineType: s.setLineType,
      setLinePreset: s.setLinePreset,
      removeLine: s.removeLine,
      updateLineBoost: s.updateLineBoost,
      updateLineTunnel: s.updateLineTunnel,
      updateLineShowSpeed: s.updateLineShowSpeed,
      updateLineLimitation: s.updateLineLimitation,
      updateLineSine: s.updateLineSine,
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
          <S.TypeButton
            $active={false}
            onClick={() => { setLineType("sine"); setMode("addLine") }}
          >
            + Sine
          </S.TypeButton>
          <S.TypeButton
            $active={false}
            onClick={() => { setLineType("curve"); setLinePreset("arc"); setMode("addLine") }}
          >
            + Arc
          </S.TypeButton>
          <S.TypeButton
            $active={false}
            onClick={() => { setLineType("elbow"); setMode("addLine") }}
          >
            + Elbow
          </S.TypeButton>
        </S.TypeRow>
      )}

      <S.LineList>
        {Object.values(editorManager.data.lines).map((line) => {
          const lineLinks = allLinks.filter(
            (lk) => lk.line1.lineId === line.id || lk.line2.lineId === line.id
          )
          return (
            <S.LineBlock key={line.id} onMouseEnter={() => setHoveredLineId(line.id)} onMouseLeave={() => setHoveredLineId(null)}>
              <S.LineItem>
                <S.LineLabel onClick={() => lineLinks.length > 0 && toggleExpand(line.id)} $clickable={lineLinks.length > 0}>
                  {lineLinks.length > 0 && (
                    <S.Chevron $open={expandedLines.has(line.id)}>▶</S.Chevron>
                  )}
                  <S.LineId>{line.id}</S.LineId>
                  <S.TypeBadge $type={line.type}>{line.type}</S.TypeBadge>
                  {lineLinks.length > 0 && !expandedLines.has(line.id) && (
                    <S.LinkCount>{lineLinks.length}</S.LinkCount>
                  )}
                </S.LineLabel>
                <S.DeleteButton onClick={() => removeLine(line.id)}>✕</S.DeleteButton>
              </S.LineItem>
              <S.BoostRow>
                <S.BoostLabel>boost</S.BoostLabel>
                <NumberInput
                  value={line.boost}
                  onChange={(v) => updateLineBoost(line.id, v)}
                  min={0}
                  step={10}
                />
              </S.BoostRow>
              <S.BoostRow>
                <S.BoostLabel>tunnel</S.BoostLabel>
                <input type="checkbox" checked={line.tunnel} onChange={(e) => updateLineTunnel(line.id, e.target.checked)} />
              </S.BoostRow>
              <S.BoostRow>
                <S.BoostLabel>show speed</S.BoostLabel>
                <input type="checkbox" checked={line.showSpeed} onChange={(e) => updateLineShowSpeed(line.id, e.target.checked)} />
              </S.BoostRow>
              <S.BoostRow>
                <S.BoostLabel>limitation</S.BoostLabel>
                <NumberInput value={line.limitation} onChange={(v) => updateLineLimitation(line.id, v)} />
              </S.BoostRow>
              {line.type === "sine" && (
                <>
                  <S.BoostRow>
                    <S.BoostLabel>freq</S.BoostLabel>
                    <NumberInput
                      value={line.frequency}
                      onChange={(v) => updateLineSine(line.id, v, line.amplitude)}
                      min={1}
                      step={1}
                    />
                  </S.BoostRow>
                  <S.BoostRow>
                    <S.BoostLabel>amp</S.BoostLabel>
                    <NumberInput
                      value={line.amplitude}
                      onChange={(v) => updateLineSine(line.id, line.frequency, v)}
                      min={1}
                      step={5}
                    />
                  </S.BoostRow>
                </>
              )}
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
