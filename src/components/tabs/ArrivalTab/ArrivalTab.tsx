import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { TOKEN_COLORS } from "engine/Token/Token"
import { ColorPicker } from "components/form/ColorPicker"
import * as S from "./UI"


export const ArrivalTab = () => {
  const { arrival, revision: _revision, mode, setMode, removeArrival, addArrivalDemand, removeArrivalDemand, updateArrivalDemand } = useStore(
    useShallow((s) => ({
      arrival: s.arrival,
      revision: s.revision,
      mode: s.mode,
      setMode: s.setMode,
      removeArrival: s.removeArrival,
      addArrivalDemand: s.addArrivalDemand,
      removeArrivalDemand: s.removeArrivalDemand,
      updateArrivalDemand: s.updateArrivalDemand,
    }))
  )

  const isPlacing = mode === "addArrival"

  return (
    <S.Container>
      {!arrival && (
        <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addArrival")}>
          {isPlacing ? "Cancel" : "+ Add Arrival"}
        </S.AddButton>
      )}

      {arrival && (
        <>
          <S.Header>
            <S.Info>{arrival.lineId} [{arrival.endpoint}]</S.Info>
            <S.DeleteButton onClick={() => removeArrival()}>✕</S.DeleteButton>
          </S.Header>

          <S.AddDemandButton onClick={() => addArrivalDemand()}>
            + Add Demand
          </S.AddDemandButton>

          <S.DemandList>
            {arrival.demands.map((d) => (
              <S.DemandCard key={d.id}>
                <S.DemandRow>
                  <S.TypeToggle $active={d.type === "round"} onClick={() => updateArrivalDemand(d.id, { type: "round" })}>●</S.TypeToggle>
                  <S.TypeToggle $active={d.type === "square"} onClick={() => updateArrivalDemand(d.id, { type: "square" })}>■</S.TypeToggle>
                  <S.DeleteButton onClick={() => removeArrivalDemand(d.id)}>✕</S.DeleteButton>
                </S.DemandRow>
                <ColorPicker palette={TOKEN_COLORS} value={d.color as any} onChange={(c) => updateArrivalDemand(d.id, { color: c })} />
                {d.type === "square" && (
                  <S.DemandRow>
                    <S.TypeToggle $active={!d.angled} onClick={() => updateArrivalDemand(d.id, { angled: false })}>0°</S.TypeToggle>
                    <S.TypeToggle $active={d.angled} onClick={() => updateArrivalDemand(d.id, { angled: true })}>45°</S.TypeToggle>
                  </S.DemandRow>
                )}
              </S.DemandCard>
            ))}
          </S.DemandList>
        </>
      )}
    </S.Container>
  )
}
