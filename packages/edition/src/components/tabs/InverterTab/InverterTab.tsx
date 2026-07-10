import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { DeleteButton } from "components/ui/DeleteButton"
import { Card } from "components/ui/Card"
import * as S from "./UI"

const INVERTER_ACCENT = "#7b1fa2"

export const InverterTab = () => {
  const { inverters, revision: _revision, mode, setMode, removeInverter, updateInverterEffect, setHoveredInverterId } = useStore(
    useShallow((s) => ({
      inverters: s.inverters,
      revision: s.revision,
      mode: s.mode,
      setMode: s.setMode,
      removeInverter: s.removeInverter,
      updateInverterEffect: s.updateInverterEffect,
      setHoveredInverterId: s.setHoveredInverterId,
    }))
  )

  const isPlacing = mode === "addInverter"

  return (
    <S.Container>
      <Button $active={isPlacing} $accent={INVERTER_ACCENT} $full onClick={() => setMode(isPlacing ? "select" : "addInverter")}>
        {isPlacing ? "Cancel" : "+ Add Inverter"}
      </Button>
      <S.InverterList>
        {Object.values(inverters).map((inv) => (
          <Card
            key={inv.id}
            $accent="#9c27b0"
            onMouseEnter={() => setHoveredInverterId(inv.id)}
            onMouseLeave={() => setHoveredInverterId(null)}
          >
            <S.Row>
              <S.InverterId>{inv.id}</S.InverterId>
              <DeleteButton onClick={() => removeInverter(inv.id)} />
            </S.Row>
            <ToggleGroup $equal>
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
          </Card>
        ))}
      </S.InverterList>
    </S.Container>
  )
}
