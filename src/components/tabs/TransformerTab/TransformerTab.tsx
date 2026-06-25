import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { TOKEN_COLORS } from "engine/Token/Token"
import { ColorPicker } from "components/form/ColorPicker"
import * as S from "./UI"

export const TransformerTab = () => {
  const { transformers, revision: _revision, mode, setMode, removeTransformer, setHoveredTransformerId, updateTransformerTargetType, updateTransformerColor, updateTransformerMode } = useStore(
    useShallow((s) => ({
      transformers: s.transformers,
      revision: s.revision,
      mode: s.mode,
      setMode: s.setMode,
      removeTransformer: s.removeTransformer,
      setHoveredTransformerId: s.setHoveredTransformerId,
      updateTransformerTargetType: s.updateTransformerTargetType,
      updateTransformerColor: s.updateTransformerColor,
      updateTransformerMode: s.updateTransformerMode,
    }))
  )

  const isPlacing = mode === "addTransformer"

  return (
    <S.Container>
      <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addTransformer")}>
        {isPlacing ? "Cancel" : "+ Add Transformer"}
      </S.AddButton>
      <S.TransformerList>
        {Object.values(transformers).map((tr) => (
          <S.TransformerCard
            key={tr.id}
            onMouseEnter={() => setHoveredTransformerId(tr.id)}
            onMouseLeave={() => setHoveredTransformerId(null)}
          >
            <S.Row>
              <S.TransformerId>{tr.id}</S.TransformerId>
              <S.DeleteButton onClick={() => removeTransformer(tr.id)}>✕</S.DeleteButton>
            </S.Row>
            <S.Row>
              <S.Label>mode</S.Label>
              <S.TypeButtons>
                <S.TypeBtn $active={tr.mode === "color"} onClick={() => updateTransformerMode(tr.id, "color")}>
                  color
                </S.TypeBtn>
                <S.TypeBtn $active={tr.mode === "shape"} onClick={() => updateTransformerMode(tr.id, "shape")}>
                  shape
                </S.TypeBtn>
              </S.TypeButtons>
            </S.Row>
            {tr.mode === "color" && (
              <ColorPicker palette={TOKEN_COLORS} value={tr.color} onChange={(c) => updateTransformerColor(tr.id, c)} />
            )}
            {tr.mode === "shape" && (
              <S.Row>
                <S.Label>target</S.Label>
                <S.TypeButtons>
                  <S.TypeBtn $active={tr.targetType === "round"} onClick={() => updateTransformerTargetType(tr.id, "round")}>
                    ○ round
                  </S.TypeBtn>
                  <S.TypeBtn $active={tr.targetType === "square"} onClick={() => updateTransformerTargetType(tr.id, "square")}>
                    □ square
                  </S.TypeBtn>
                </S.TypeButtons>
              </S.Row>
            )}
          </S.TransformerCard>
        ))}
      </S.TransformerList>
    </S.Container>
  )
}
