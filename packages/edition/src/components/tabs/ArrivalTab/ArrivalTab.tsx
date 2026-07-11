import { useShallow } from "zustand/react/shallow"
import { useToggleSet } from "hooks/useToggleSet"
import { useStore } from "store"
import { TOKEN_COLORS, ANGLED_LABEL, TYPE_GLYPH, type TokenColor, type TokenType } from "@drift/engine/entities/Token/Token"
import { ColorPicker } from "components/form/ColorPicker"
import { Field } from "components/form/Field"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { DeleteButton } from "components/ui/DeleteButton"
import { EntityHeader } from "components/ui/EntityHeader"
import { Card } from "components/ui/Card"
import { Divider } from "components/ui/Divider"
import * as S from "./UI"

const ARRIVAL_ACCENT = "#333"

export const ArrivalTab = () => {
  const {
    arrivals, revision: _revision, mode, currentScreenId, setMode,
    removeArrival, addArrivalDemand, removeArrivalDemand, updateArrivalDemand, setArrivalQueueSide,
  } = useStore(
    useShallow((s) => ({
      arrivals: s.arrivals,
      revision: s.revision,
      mode: s.mode,
      currentScreenId: s.currentScreenId,
      setMode: s.setMode,
      removeArrival: s.removeArrival,
      addArrivalDemand: s.addArrivalDemand,
      removeArrivalDemand: s.removeArrivalDemand,
      updateArrivalDemand: s.updateArrivalDemand,
      setArrivalQueueSide: s.setArrivalQueueSide,
    }))
  )

  const isPlacing = mode === "addArrival"
  const arrivalsForScreen = Object.values(arrivals).filter((arrival) => arrival.screenId === currentScreenId)
  const collapsed = useToggleSet()

  return (
    <S.Container>
      <Button $active={isPlacing} $accent={ARRIVAL_ACCENT} $full onClick={() => setMode(isPlacing ? "select" : "addArrival")}>
        {isPlacing ? "Cancel" : "+ Add Arrival"}
      </Button>

      <S.ArrivalList>
        {arrivalsForScreen.map((arrival) => (
          <Card key={arrival.id}>
            <EntityHeader
              screenId={arrival.screenId}
              onDelete={() => removeArrival(arrival.id)}
              collapsed={collapsed.has(arrival.id)}
              onToggleCollapsed={() => collapsed.toggle(arrival.id)}
            >
              <S.Info>{arrival.id}</S.Info>
            </EntityHeader>
            {!collapsed.has(arrival.id) && (
              <>
                <Divider />

                <Field label="Queue side" $direction="row">
                  <ToggleGroup $wrap>
                    <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={arrival.queueSide === "top"} onClick={() => setArrivalQueueSide(arrival.id, "top")}>Haut</Button>
                    <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={arrival.queueSide === "bottom"} onClick={() => setArrivalQueueSide(arrival.id, "bottom")}>Bas</Button>
                    <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={arrival.queueSide === "left"} onClick={() => setArrivalQueueSide(arrival.id, "left")}>Gauche</Button>
                    <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={arrival.queueSide === "right"} onClick={() => setArrivalQueueSide(arrival.id, "right")}>Droite</Button>
                    <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={arrival.queueSide === "hidden"} onClick={() => setArrivalQueueSide(arrival.id, "hidden")}>Masqué</Button>
                  </ToggleGroup>
                </Field>

                <Divider />
                <S.DemandSectionHeader>
                  <S.DemandSectionLabel>Demands</S.DemandSectionLabel>
                  <S.AddDemandButton onClick={() => addArrivalDemand(arrival.id)}>+</S.AddDemandButton>
                </S.DemandSectionHeader>

                <S.DemandList>
                  {arrival.demands.map((d) => (
                    <Card key={d.id} $nested>
                      <S.DemandHeader>
                        <S.DemandId>{d.id}</S.DemandId>
                        <DeleteButton onClick={() => removeArrivalDemand(arrival.id, d.id)} />
                      </S.DemandHeader>
                      <Divider />
                      <Field label="Type" $direction="row">
                        <ToggleGroup>
                          <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={d.type === "round"} onClick={() => updateArrivalDemand(arrival.id, d.id, { type: "round" })}>{TYPE_GLYPH.round}</Button>
                          <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={d.type === "square"} onClick={() => updateArrivalDemand(arrival.id, d.id, { type: "square" })}>{TYPE_GLYPH.square}</Button>
                          <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={d.type === "triangle"} onClick={() => updateArrivalDemand(arrival.id, d.id, { type: "triangle" })}>{TYPE_GLYPH.triangle}</Button>
                        </ToggleGroup>
                      </Field>
                      <Field label="Color" $direction="row">
                        <ColorPicker palette={TOKEN_COLORS} value={d.color as TokenColor} onChange={(c) => updateArrivalDemand(arrival.id, d.id, { color: c as TokenColor })} />
                      </Field>
                      {ANGLED_LABEL[d.type as TokenType] && (
                        <Field label="Angle" $direction="row">
                          <ToggleGroup>
                            <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={!d.angled} onClick={() => updateArrivalDemand(arrival.id, d.id, { angled: false })}>0°</Button>
                            <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={d.angled} onClick={() => updateArrivalDemand(arrival.id, d.id, { angled: true })}>{ANGLED_LABEL[d.type as TokenType]}</Button>
                          </ToggleGroup>
                        </Field>
                      )}
                    </Card>
                  ))}
                </S.DemandList>
              </>
            )}
          </Card>
        ))}
      </S.ArrivalList>
    </S.Container>
  )
}
