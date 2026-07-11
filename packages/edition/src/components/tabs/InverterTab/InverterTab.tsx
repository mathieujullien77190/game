import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { Field } from "components/form/Field"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { Box } from "components/ui/Box"
import * as S from "./UI"

const INVERTER_ACCENT = "#333"

export const InverterTab = () => {
  const { inverters, revision: _revision, mode, currentScreenId, setMode, removeInverter, updateInverterEffect, setHoveredInverterId } = useStore(
    useShallow((s) => ({
      inverters: s.inverters,
      revision: s.revision,
      mode: s.mode,
      currentScreenId: s.currentScreenId,
      setMode: s.setMode,
      removeInverter: s.removeInverter,
      updateInverterEffect: s.updateInverterEffect,
      setHoveredInverterId: s.setHoveredInverterId,
    }))
  )

  const isPlacing = mode === "addInverter"
  const invertersForScreen = Object.values(inverters).filter((inv) => inv.screenId === currentScreenId)

  return (
    <S.Container>
      <Button $active={isPlacing} $accent={INVERTER_ACCENT} $full onClick={() => setMode(isPlacing ? "select" : "addInverter")}>
        {isPlacing ? "Cancel" : "+ Add Inverter"}
      </Button>
      <S.InverterList>
        {invertersForScreen.map((inv) => (
          <Box
            key={inv.id}
            id={inv.id}
            screenId={inv.screenId}
            onDelete={() => removeInverter(inv.id)}
            onMouseEnter={() => setHoveredInverterId(inv.id)}
            onMouseLeave={() => setHoveredInverterId(null)}
          >
            <Field label="type" $direction="row">
              <ToggleGroup $wrap>
                <Button $size="sm" $accent={INVERTER_ACCENT} $active={!inv.effect || inv.effect === "invert"} onClick={() => updateInverterEffect(inv.id, "invert")}>
                  invert
                </Button>
                <Button $size="sm" $accent={INVERTER_ACCENT} $active={inv.effect === "grayscale"} onClick={() => updateInverterEffect(inv.id, "grayscale")}>
                  gray
                </Button>
                <Button $size="sm" $accent={INVERTER_ACCENT} $active={inv.effect === "dark"} onClick={() => updateInverterEffect(inv.id, "dark")}>
                  dark
                </Button>
              </ToggleGroup>
            </Field>
          </Box>
        ))}
      </S.InverterList>
    </S.Container>
  )
}
