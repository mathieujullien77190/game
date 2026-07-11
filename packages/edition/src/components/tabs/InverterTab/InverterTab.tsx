import { useShallow } from "zustand/react/shallow"
import { useToggleSet } from "hooks/useToggleSet"
import { useStore } from "store"
import { Field } from "components/form/Field"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { EntityHeader } from "components/ui/EntityHeader"
import { Card } from "components/ui/Card"
import { Divider } from "components/ui/Divider"
import * as S from "./UI"

const INVERTER_ACCENT = "#7b1fa2"

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
  const collapsed = useToggleSet()

  return (
    <S.Container>
      <Button $active={isPlacing} $accent={INVERTER_ACCENT} $full onClick={() => setMode(isPlacing ? "select" : "addInverter")}>
        {isPlacing ? "Cancel" : "+ Add Inverter"}
      </Button>
      <S.InverterList>
        {invertersForScreen.map((inv) => (
          <Card
            key={inv.id}
            $accent="#9c27b0"
            onMouseEnter={() => setHoveredInverterId(inv.id)}
            onMouseLeave={() => setHoveredInverterId(null)}
          >
            <EntityHeader
              screenId={inv.screenId}
              onDelete={() => removeInverter(inv.id)}
              collapsed={collapsed.has(inv.id)}
              onToggleCollapsed={() => collapsed.toggle(inv.id)}
            >
              <S.InverterId>{inv.id}</S.InverterId>
            </EntityHeader>
            {!collapsed.has(inv.id) && (
              <>
                <Divider />
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
              </>
            )}
          </Card>
        ))}
      </S.InverterList>
    </S.Container>
  )
}
