import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { TOKEN_COLORS, type TokenColor } from "@drift/engine/entities/Token/Token"
import { ColorPicker } from "components/form/ColorPicker"
import { Field } from "components/form/Field"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { DeleteButton } from "components/ui/DeleteButton"
import { Card } from "components/ui/Card"
import * as S from "./UI"

const ARRIVAL_ACCENT = "#333"

export const ArrivalTab = () => {
  const {
    arrivals, revision: _revision, mode, setMode,
    removeArrival, addArrivalDemand, removeArrivalDemand, updateArrivalDemand, setArrivalQueueSide,
  } = useStore(
    useShallow((s) => ({
      arrivals: s.arrivals,
      revision: s.revision,
      mode: s.mode,
      setMode: s.setMode,
      removeArrival: s.removeArrival,
      addArrivalDemand: s.addArrivalDemand,
      removeArrivalDemand: s.removeArrivalDemand,
      updateArrivalDemand: s.updateArrivalDemand,
      setArrivalQueueSide: s.setArrivalQueueSide,
    }))
  )

  const isPlacing = mode === "addArrival"

  return (
    <S.Container>
      <Button $active={isPlacing} $accent={ARRIVAL_ACCENT} $full onClick={() => setMode(isPlacing ? "select" : "addArrival")}>
        {isPlacing ? "Cancel" : "+ Add Arrival"}
      </Button>

      <S.ArrivalList>
        {Object.values(arrivals).map((arrival) => (
          <S.ArrivalCard key={arrival.id}>
            <S.Header>
              <S.Info>{arrival.lineId} [{arrival.endpoint}]</S.Info>
              <DeleteButton onClick={() => removeArrival(arrival.id)} />
            </S.Header>

            <Field label="Queue side">
              <ToggleGroup $wrap>
                <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={arrival.queueSide === "top"} onClick={() => setArrivalQueueSide(arrival.id, "top")}>Haut</Button>
                <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={arrival.queueSide === "bottom"} onClick={() => setArrivalQueueSide(arrival.id, "bottom")}>Bas</Button>
                <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={arrival.queueSide === "left"} onClick={() => setArrivalQueueSide(arrival.id, "left")}>Gauche</Button>
                <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={arrival.queueSide === "right"} onClick={() => setArrivalQueueSide(arrival.id, "right")}>Droite</Button>
                <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={arrival.queueSide === "hidden"} onClick={() => setArrivalQueueSide(arrival.id, "hidden")}>Masqué</Button>
              </ToggleGroup>
            </Field>

            <S.AddDemandButton onClick={() => addArrivalDemand(arrival.id)}>
              + Add Demand
            </S.AddDemandButton>

            <S.DemandList>
              {arrival.demands.map((d) => (
                <Card key={d.id} $nested>
                  <S.DemandRow>
                    <ToggleGroup>
                      <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={d.type === "round"} onClick={() => updateArrivalDemand(arrival.id, d.id, { type: "round" })}>●</Button>
                      <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={d.type === "square"} onClick={() => updateArrivalDemand(arrival.id, d.id, { type: "square" })}>■</Button>
                    </ToggleGroup>
                    <DeleteButton onClick={() => removeArrivalDemand(arrival.id, d.id)} />
                  </S.DemandRow>
                  <ColorPicker palette={TOKEN_COLORS} value={d.color as any} onChange={(c) => updateArrivalDemand(arrival.id, d.id, { color: c as TokenColor })} />
                  {d.type === "square" && (
                    <ToggleGroup>
                      <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={!d.angled} onClick={() => updateArrivalDemand(arrival.id, d.id, { angled: false })}>0°</Button>
                      <Button $size="sm" $accent={ARRIVAL_ACCENT} $active={d.angled} onClick={() => updateArrivalDemand(arrival.id, d.id, { angled: true })}>45°</Button>
                    </ToggleGroup>
                  )}
                </Card>
              ))}
            </S.DemandList>
          </S.ArrivalCard>
        ))}
      </S.ArrivalList>
    </S.Container>
  )
}
