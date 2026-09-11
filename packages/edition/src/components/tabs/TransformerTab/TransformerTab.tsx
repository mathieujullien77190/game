import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { TOKEN_COLORS, TYPE_GLYPH } from "@tic-tac-tic/engine/entities/Token/Token"
import { ColorPicker } from "components/form/ColorPicker"
import { NumberInput } from "components/form/NumberInput"
import { Field } from "components/form/Field"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { Box } from "components/ui/Box"
import * as S from "./UI"
import type { TransformerType } from "@tic-tac-tic/engine/entities/Transformer/Transformer"

const ALL_TYPES: TransformerType[] = ["fade", "rotate", "color", "shape"]
const TRANSFORMER_ACCENT = "#333"

export const TransformerTab = () => {
  const {
    transformers, revision: _revision, mode, currentScreenId,
    setMode, removeTransformer, setHoveredTransformerId,
    updateTransformerAmount, updateTransformerColor, updateTransformerTargetType, updateTransformerType,
  } = useStore(
    useShallow((s) => ({
      transformers: s.transformers,
      revision: s.revision,
      mode: s.mode,
      currentScreenId: s.currentScreenId,
      setMode: s.setMode,
      removeTransformer: s.removeTransformer,
      setHoveredTransformerId: s.setHoveredTransformerId,
      updateTransformerAmount: s.updateTransformerAmount,
      updateTransformerColor: s.updateTransformerColor,
      updateTransformerTargetType: s.updateTransformerTargetType,
      updateTransformerType: s.updateTransformerType,
    }))
  )

  const isPlacing = mode === "addTransformer"
  const transformersForScreen = Object.values(transformers).filter((tr) => tr.screenId === currentScreenId)

  return (
    <S.Container>
      <Button $active={isPlacing} $accent={TRANSFORMER_ACCENT} $full onClick={() => setMode(isPlacing ? "select" : "addTransformer")}>
        {isPlacing ? "Cancel" : "+ Add Transformer"}
      </Button>
      <S.TransformerList>
        {transformersForScreen.map((tr) => (
          <Box
            key={tr.id}
            id={tr.id}
            screenId={tr.screenId}
            onDelete={() => removeTransformer(tr.id)}
            onMouseEnter={() => setHoveredTransformerId(tr.id)}
            onMouseLeave={() => setHoveredTransformerId(null)}
          >
            <Field label="type" $direction="row">
              <ToggleGroup $wrap>
                {ALL_TYPES.map((t) => (
                  <Button key={t} $size="sm" $accent={TRANSFORMER_ACCENT} $active={tr.type === t} onClick={() => updateTransformerType(tr.id, t)}>
                    {t}
                  </Button>
                ))}
              </ToggleGroup>
            </Field>
            {tr.type === "fade" && (
              <Field label="opacity" $direction="row">
                <NumberInput
                  value={tr.amount}
                  min={0.05}
                  max={1}
                  step={0.05}
                  commitOn="blur"
                  onChange={(v) => updateTransformerAmount(tr.id, v)}
                />
              </Field>
            )}
            {tr.type === "color" && (
              <Field label="color" $direction="row">
                <ColorPicker palette={TOKEN_COLORS} value={tr.color} onChange={(c) => updateTransformerColor(tr.id, c)} />
              </Field>
            )}
            {tr.type === "shape" && (
              <Field label="target" $direction="row">
                <ToggleGroup $wrap>
                  <Button $size="sm" $accent={TRANSFORMER_ACCENT} $active={tr.targetType === "round"} onClick={() => updateTransformerTargetType(tr.id, "round")}>
                    {TYPE_GLYPH.round}
                  </Button>
                  <Button $size="sm" $accent={TRANSFORMER_ACCENT} $active={tr.targetType === "square"} onClick={() => updateTransformerTargetType(tr.id, "square")}>
                    {TYPE_GLYPH.square}
                  </Button>
                  <Button $size="sm" $accent={TRANSFORMER_ACCENT} $active={tr.targetType === "triangle"} onClick={() => updateTransformerTargetType(tr.id, "triangle")}>
                    {TYPE_GLYPH.triangle}
                  </Button>
                </ToggleGroup>
              </Field>
            )}
          </Box>
        ))}
      </S.TransformerList>
    </S.Container>
  )
}
