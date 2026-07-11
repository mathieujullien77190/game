import { useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { NumberInput } from "components/form/NumberInput"
import { ColorPicker } from "components/form/ColorPicker"
import { Checkbox } from "components/form/Checkbox"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { DeleteButton } from "components/ui/DeleteButton"
import { TOKEN_COLORS } from "@drift/engine/entities/Token/Token"
import * as S from "./UI"

export const LineTab = () => {
  const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) =>
    setExpandedLines((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const { editorManager, mode, setMode, setLineType, setLinePreset, removeLine, updateLineBoost, updateLineTunnel, updateLineShowSpeed, updateLineLimitation, updateLineColor, updateLineSine, updateLineSpiral, toggleLinkActivated, setHoveredLineId } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      mode: s.mode,
      setMode: s.setMode,
      setLineType: s.setLineType,
      setLinePreset: s.setLinePreset,
      removeLine: s.removeLine,
      updateLineBoost: s.updateLineBoost,
      updateLineTunnel: s.updateLineTunnel,
      updateLineShowSpeed: s.updateLineShowSpeed,
      updateLineLimitation: s.updateLineLimitation,
      updateLineColor: s.updateLineColor,
      updateLineSine: s.updateLineSine,
      updateLineSpiral: s.updateLineSpiral,
      toggleLinkActivated: s.toggleLinkActivated,
      setHoveredLineId: s.setHoveredLineId,
    }))
  )

  const allLinks = Object.values(editorManager.data.links)

  return (
    <S.Container>
      {mode === "addLine" ? (
        <Button $active $accent="#1a73e8" $full onClick={() => setMode("select")}>Cancel</Button>
      ) : (
        <ToggleGroup $equal>
          <Button $accent="#333" $size="sm" onClick={() => { setLineType("straight"); setMode("addLine") }}>
            + Straight
          </Button>
          <Button $accent="#333" $size="sm" onClick={() => { setLineType("curve"); setMode("addLine") }}>
            + Curve
          </Button>
          <Button $accent="#333" $size="sm" onClick={() => { setLineType("sine"); setMode("addLine") }}>
            + Sine
          </Button>
          <Button $accent="#333" $size="sm" onClick={() => { setLineType("curve"); setLinePreset("arc"); setMode("addLine") }}>
            + Arc
          </Button>
          <Button $accent="#333" $size="sm" onClick={() => { setLineType("elbow"); setMode("addLine") }}>
            + Elbow
          </Button>
          <Button $accent="#333" $size="sm" onClick={() => { setLineType("spiral"); setMode("addLine") }}>
            + Spiral
          </Button>
        </ToggleGroup>
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
                <DeleteButton onClick={() => removeLine(line.id)} />
              </S.LineItem>
              <S.ParamsBox>
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
                  <Checkbox checked={line.tunnel} onChange={(checked) => updateLineTunnel(line.id, checked)} />
                </S.BoostRow>
                <S.BoostRow>
                  <S.BoostLabel>show speed</S.BoostLabel>
                  <Checkbox checked={line.showSpeed} onChange={(checked) => updateLineShowSpeed(line.id, checked)} />
                </S.BoostRow>
                <S.BoostRow>
                  <S.BoostLabel>limitation</S.BoostLabel>
                  <NumberInput value={line.limitation} onChange={(v) => updateLineLimitation(line.id, v)} />
                </S.BoostRow>
                <S.BoostRow>
                  <S.BoostLabel>color</S.BoostLabel>
                  <ColorPicker
                    palette={TOKEN_COLORS}
                    value={line.color ?? ""}
                    onChange={(color) => updateLineColor(line.id, color)}
                    onClear={() => updateLineColor(line.id, null)}
                  />
                </S.BoostRow>
                {line.type === "spiral" && (
                  <S.BoostRow>
                    <S.BoostLabel>turns</S.BoostLabel>
                    <NumberInput
                      value={line.turns}
                      onChange={(v) => updateLineSpiral(line.id, v)}
                      step={1}
                    />
                  </S.BoostRow>
                )}
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
              </S.ParamsBox>
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
