import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { TOKEN_COLORS, type TokenColor } from "@drift/engine/entities/Token/Token"
import { ColorPicker } from "components/form/ColorPicker"
import * as S from "./UI"


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
      <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addArrival")}>
        {isPlacing ? "Cancel" : "+ Add Arrival"}
      </S.AddButton>

      <S.ArrivalList>
        {Object.values(arrivals).map((arrival) => (
          <S.ArrivalCard key={arrival.id}>
            <S.Header>
              <S.Info>{arrival.lineId} [{arrival.endpoint}]</S.Info>
              <S.DeleteButton onClick={() => removeArrival(arrival.id)}>✕</S.DeleteButton>
            </S.Header>

            <S.Field>
              <S.FieldLabel>Queue side</S.FieldLabel>
              <S.QueueSideRow>
                <S.TypeToggle $active={arrival.queueSide === "top"} onClick={() => setArrivalQueueSide(arrival.id, "top")}>Haut</S.TypeToggle>
                <S.TypeToggle $active={arrival.queueSide === "bottom"} onClick={() => setArrivalQueueSide(arrival.id, "bottom")}>Bas</S.TypeToggle>
                <S.TypeToggle $active={arrival.queueSide === "left"} onClick={() => setArrivalQueueSide(arrival.id, "left")}>Gauche</S.TypeToggle>
                <S.TypeToggle $active={arrival.queueSide === "right"} onClick={() => setArrivalQueueSide(arrival.id, "right")}>Droite</S.TypeToggle>
                <S.TypeToggle $active={arrival.queueSide === "hidden"} onClick={() => setArrivalQueueSide(arrival.id, "hidden")}>Masqué</S.TypeToggle>
              </S.QueueSideRow>
            </S.Field>

            <S.AddDemandButton onClick={() => addArrivalDemand(arrival.id)}>
              + Add Demand
            </S.AddDemandButton>

            <S.DemandList>
              {arrival.demands.map((d) => (
                <S.DemandCard key={d.id}>
                  <S.DemandRow>
                    <S.TypeToggle $active={d.type === "round"} onClick={() => updateArrivalDemand(arrival.id, d.id, { type: "round" })}>●</S.TypeToggle>
                    <S.TypeToggle $active={d.type === "square"} onClick={() => updateArrivalDemand(arrival.id, d.id, { type: "square" })}>■</S.TypeToggle>
                    <S.DeleteButton onClick={() => removeArrivalDemand(arrival.id, d.id)}>✕</S.DeleteButton>
                  </S.DemandRow>
                  <ColorPicker palette={TOKEN_COLORS} value={d.color as any} onChange={(c) => updateArrivalDemand(arrival.id, d.id, { color: c as TokenColor })} />
                  {d.type === "square" && (
                    <S.DemandRow>
                      <S.TypeToggle $active={!d.angled} onClick={() => updateArrivalDemand(arrival.id, d.id, { angled: false })}>0°</S.TypeToggle>
                      <S.TypeToggle $active={d.angled} onClick={() => updateArrivalDemand(arrival.id, d.id, { angled: true })}>45°</S.TypeToggle>
                    </S.DemandRow>
                  )}
                </S.DemandCard>
              ))}
            </S.DemandList>
          </S.ArrivalCard>
        ))}
      </S.ArrivalList>
    </S.Container>
  )
}
