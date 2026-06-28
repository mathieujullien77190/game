import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { TOKEN_COLORS } from "engine/Token/Token"
import { ColorPicker } from "components/form/ColorPicker"
import { NumberInput } from "components/form/NumberInput"
import * as S from "./UI"
import type { TransformerType } from "engine/Transformer/Transformer"

const ALL_TYPES: TransformerType[] = ["fade", "rotate", "color", "shape"]

export const TransformerTab = () => {
  const {
    transformers, revision: _revision, mode, pendingTransformerType,
    setMode, removeTransformer, setHoveredTransformerId,
    updateTransformerAmount, updateTransformerColor, updateTransformerTargetType, updateTransformerType,
    setPendingTransformerType,
  } = useStore(
    useShallow((s) => ({
      transformers: s.transformers,
      revision: s.revision,
      mode: s.mode,
      pendingTransformerType: s.pendingTransformerType,
      setMode: s.setMode,
      removeTransformer: s.removeTransformer,
      setHoveredTransformerId: s.setHoveredTransformerId,
      updateTransformerAmount: s.updateTransformerAmount,
      updateTransformerColor: s.updateTransformerColor,
      updateTransformerTargetType: s.updateTransformerTargetType,
      updateTransformerType: s.updateTransformerType,
      setPendingTransformerType: s.setPendingTransformerType,
    }))
  )

  const isPlacing = mode === "addTransformer"

  return (
    <S.Container>
      <S.TypeRow>
        {ALL_TYPES.map((t) => (
          <S.TypeButton key={t} $active={pendingTransformerType === t} onClick={() => setPendingTransformerType(t)}>
            {t}
          </S.TypeButton>
        ))}
      </S.TypeRow>
      <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addTransformer")}>
        {isPlacing ? "Cancel" : `+ Add ${pendingTransformerType}`}
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
              <S.Label>type</S.Label>
              <S.TypeButtons>
                {ALL_TYPES.map((t) => (
                  <S.TypeBtn key={t} $active={tr.type === t} onClick={() => updateTransformerType(tr.id, t)}>
                    {t}
                  </S.TypeBtn>
                ))}
              </S.TypeButtons>
            </S.Row>
            {tr.type === "fade" && (
              <S.Row>
                <S.Label>opacity</S.Label>
                <NumberInput
                  value={tr.amount}
                  min={0.05}
                  step={0.05}
                  float
                  onChange={(v) => updateTransformerAmount(tr.id, Math.min(1, Math.max(0.05, v)))}
                />
              </S.Row>
            )}
            {tr.type === "color" && (
              <ColorPicker palette={TOKEN_COLORS} value={tr.color} onChange={(c) => updateTransformerColor(tr.id, c)} />
            )}
            {tr.type === "shape" && (
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
