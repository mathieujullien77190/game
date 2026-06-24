import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { TOKEN_COLORS } from "engine/Token/Token"
import { ColorPicker } from "components/form/ColorPicker"
import * as S from "./UI"

export const PainterTab = () => {
  const { painters, revision: _revision, mode, setMode, removePainter, setPainterColor, setHoveredPainterId } = useStore(
    useShallow((s) => ({
      painters: s.painters,
      revision: s.revision,
      mode: s.mode,
      setMode: s.setMode,
      removePainter: s.removePainter,
      setPainterColor: s.setPainterColor,
      setHoveredPainterId: s.setHoveredPainterId,
    }))
  )

  const isPlacing = mode === "addPainter"

  return (
    <S.Container>
      <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addPainter")}>
        {isPlacing ? "Cancel" : "+ Add Painter"}
      </S.AddButton>
      <S.PainterList>
        {Object.values(painters).map((p) => (
          <S.PainterCard
            key={p.id}
            $color={p.color}
            onMouseEnter={() => setHoveredPainterId(p.id)}
            onMouseLeave={() => setHoveredPainterId(null)}
          >
            <S.Row>
              <S.PainterId>{p.id}</S.PainterId>
              <S.DeleteButton onClick={() => removePainter(p.id)}>✕</S.DeleteButton>
            </S.Row>
            <ColorPicker palette={TOKEN_COLORS} value={p.color} onChange={(c) => setPainterColor(p.id, c)} />
          </S.PainterCard>
        ))}
      </S.PainterList>
    </S.Container>
  )
}
