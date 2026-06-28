import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import type { HelpArrow } from "engine/Help/Help"
import * as S from "./UI"

const ARROWS: HelpArrow[] = ["none", "top", "right", "bottom", "left"]
const ARROW_LABEL: Record<HelpArrow, string> = { none: "—", top: "↑", right: "→", bottom: "↓", left: "←" }

export const HelpTab = () => {
  const { helps, selectedHelpId, mode, revision: _revision, setMode, addHelp, removeHelp, updateHelp, setSelectedHelpId } = useStore(
    useShallow((s) => ({
      helps: s.helps,
      selectedHelpId: s.selectedHelpId,
      mode: s.mode,
      revision: s.revision,
      setMode: s.setMode,
      addHelp: s.addHelp,
      removeHelp: s.removeHelp,
      updateHelp: s.updateHelp,
      setSelectedHelpId: s.setSelectedHelpId,
    }))
  )

  const isPlacing = mode === "addHelp"
  const selected = selectedHelpId ? helps[selectedHelpId] : null

  return (
    <S.Container>
      <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addHelp")}>
        {isPlacing ? "Cancel" : "+ Add Help"}
      </S.AddButton>

      <S.HelpList>
        {Object.values(helps).map((h) => (
          <S.HelpCard key={h.id} $selected={selectedHelpId === h.id} onClick={() => setSelectedHelpId(h.id)}>
            <S.HelpId>{h.id}</S.HelpId>
            <S.HelpPreviewText>{h.text || "(empty)"}</S.HelpPreviewText>
            <S.DeleteButton onClick={(e) => { e.stopPropagation(); removeHelp(h.id) }}>✕</S.DeleteButton>
          </S.HelpCard>
        ))}
      </S.HelpList>

      {selected && (
        <S.EditSection>
          <div>
            <S.Label>Text</S.Label>
            <S.TextArea
              value={selected.text}
              onChange={(e) => updateHelp(selected.id, { text: e.target.value })}
              placeholder="Help text..."
            />
          </div>
          <div>
            <S.Label>Arrow</S.Label>
            <S.ArrowRow>
              {ARROWS.map((a) => (
                <S.ArrowButton key={a} $active={selected.arrow === a} onClick={() => updateHelp(selected.id, { arrow: a })}>
                  {ARROW_LABEL[a]}
                </S.ArrowButton>
              ))}
            </S.ArrowRow>
          </div>
        </S.EditSection>
      )}
    </S.Container>
  )
}
