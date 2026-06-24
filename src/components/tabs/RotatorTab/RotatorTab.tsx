import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import * as S from "./UI"

export const RotatorTab = () => {
  const { rotators, revision: _revision, mode, setMode, removeRotator, setHoveredRotatorId } = useStore(
    useShallow((s) => ({
      rotators: s.rotators,
      revision: s.revision,
      mode: s.mode,
      setMode: s.setMode,
      removeRotator: s.removeRotator,
      setHoveredRotatorId: s.setHoveredRotatorId,
    }))
  )

  const isPlacing = mode === "addRotator"

  return (
    <S.Container>
      <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addRotator")}>
        {isPlacing ? "Cancel" : "+ Add Rotator"}
      </S.AddButton>
      <S.RotatorList>
        {Object.values(rotators).map((rot) => (
          <S.RotatorCard
            key={rot.id}
            onMouseEnter={() => setHoveredRotatorId(rot.id)}
            onMouseLeave={() => setHoveredRotatorId(null)}
          >
            <S.Row>
              <S.RotatorId>{rot.id}</S.RotatorId>
              <S.DeleteButton onClick={() => removeRotator(rot.id)}>✕</S.DeleteButton>
            </S.Row>
          </S.RotatorCard>
        ))}
      </S.RotatorList>
    </S.Container>
  )
}
