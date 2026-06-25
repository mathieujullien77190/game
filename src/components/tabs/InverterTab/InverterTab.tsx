import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import * as S from "./UI"

export const InverterTab = () => {
  const { inverters, revision: _revision, mode, setMode, removeInverter, setHoveredInverterId } = useStore(
    useShallow((s) => ({
      inverters: s.inverters,
      revision: s.revision,
      mode: s.mode,
      setMode: s.setMode,
      removeInverter: s.removeInverter,
      setHoveredInverterId: s.setHoveredInverterId,
    }))
  )

  const isPlacing = mode === "addInverter"

  return (
    <S.Container>
      <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addInverter")}>
        {isPlacing ? "Cancel" : "+ Add Inverter"}
      </S.AddButton>
      <S.InverterList>
        {Object.values(inverters).map((inv) => (
          <S.InverterCard
            key={inv.id}
            onMouseEnter={() => setHoveredInverterId(inv.id)}
            onMouseLeave={() => setHoveredInverterId(null)}
          >
            <S.Row>
              <S.InverterId>{inv.id}</S.InverterId>
              <S.DeleteButton onClick={() => removeInverter(inv.id)}>✕</S.DeleteButton>
            </S.Row>
          </S.InverterCard>
        ))}
      </S.InverterList>
    </S.Container>
  )
}
