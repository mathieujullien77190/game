import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { TOKEN_COLORS } from "@drift/engine/entities/Token/Token"
import { ColorPicker } from "components/form/ColorPicker"
import { NumberInput } from "components/form/NumberInput"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { DeleteButton } from "components/ui/DeleteButton"
import { Card } from "components/ui/Card"
import * as S from "./UI"
import type { TransformerType } from "@drift/engine/entities/Transformer/Transformer"

const ALL_TYPES: TransformerType[] = ["fade", "rotate", "color", "shape"]
const TRANSFORMER_ACCENT = "#2e7d32"

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
      <ToggleGroup $equal>
        {ALL_TYPES.map((t) => (
          <Button key={t} $size="sm" $accent={TRANSFORMER_ACCENT} $active={pendingTransformerType === t} onClick={() => setPendingTransformerType(t)}>
            {t}
          </Button>
        ))}
      </ToggleGroup>
      <Button $active={isPlacing} $accent={TRANSFORMER_ACCENT} $full onClick={() => setMode(isPlacing ? "select" : "addTransformer")}>
        {isPlacing ? "Cancel" : `+ Add ${pendingTransformerType}`}
      </Button>
      <S.TransformerList>
        {Object.values(transformers).map((tr) => (
          <Card
            key={tr.id}
            onMouseEnter={() => setHoveredTransformerId(tr.id)}
            onMouseLeave={() => setHoveredTransformerId(null)}
          >
            <S.Row>
              <S.TransformerId>{tr.id}</S.TransformerId>
              <DeleteButton onClick={() => removeTransformer(tr.id)} />
            </S.Row>
            <S.Row>
              <S.Label>type</S.Label>
              <ToggleGroup $wrap>
                {ALL_TYPES.map((t) => (
                  <Button key={t} $size="sm" $accent={TRANSFORMER_ACCENT} $active={tr.type === t} onClick={() => updateTransformerType(tr.id, t)}>
                    {t}
                  </Button>
                ))}
              </ToggleGroup>
            </S.Row>
            {tr.type === "fade" && (
              <S.Row>
                <S.Label>opacity</S.Label>
                <NumberInput
                  value={tr.amount}
                  min={0.05}
                  max={1}
                  step={0.05}
                  commitOn="blur"
                  onChange={(v) => updateTransformerAmount(tr.id, v)}
                />
              </S.Row>
            )}
            {tr.type === "color" && (
              <ColorPicker palette={TOKEN_COLORS} value={tr.color} onChange={(c) => updateTransformerColor(tr.id, c)} />
            )}
            {tr.type === "shape" && (
              <S.Row>
                <S.Label>target</S.Label>
                <ToggleGroup $wrap>
                  <Button $size="sm" $accent={TRANSFORMER_ACCENT} $active={tr.targetType === "round"} onClick={() => updateTransformerTargetType(tr.id, "round")}>
                    ○ round
                  </Button>
                  <Button $size="sm" $accent={TRANSFORMER_ACCENT} $active={tr.targetType === "square"} onClick={() => updateTransformerTargetType(tr.id, "square")}>
                    □ square
                  </Button>
                  <Button $size="sm" $accent={TRANSFORMER_ACCENT} $active={tr.targetType === "triangle"} onClick={() => updateTransformerTargetType(tr.id, "triangle")}>
                    △ triangle
                  </Button>
                </ToggleGroup>
              </S.Row>
            )}
          </Card>
        ))}
      </S.TransformerList>
    </S.Container>
  )
}
