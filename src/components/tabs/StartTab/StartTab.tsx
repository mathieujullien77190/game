import { useShallow } from "zustand/react/shallow"
import { NumberInput } from "components/form/NumberInput"
import { useStore } from "store"
import * as S from "./UI"

export const StartTab = () => {
  const { starts, mode, setMode, removeStart, updateStartDelay } = useStore(
    useShallow((s) => ({
      starts: s.starts,
      mode: s.mode,
      setMode: s.setMode,
      removeStart: s.removeStart,
      updateStartDelay: s.updateStartDelay,
    }))
  )

  const isPlacing = mode === "addStart"
  const hasStart = Object.keys(starts).length > 0

  return (
    <S.Container>
      {!hasStart && (
        <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addStart")}>
          {isPlacing ? "Cancel" : "+ Add Start"}
        </S.AddButton>
      )}

      <S.StartList>
        {Object.values(starts).map((start) => (
          <S.StartCard key={start.id}>
            <S.StartHeader>
              <S.StartInfo>{start.lineId} [{start.endpoint}]</S.StartInfo>
              <S.DeleteButton onClick={() => removeStart(start.id)}>✕</S.DeleteButton>
            </S.StartHeader>
            <S.Divider />
            <NumberInput
              label="Delay (s)"
              value={start.delay}
              min={1}
              onChange={(v) => updateStartDelay(start.id, v)}
            />
          </S.StartCard>
        ))}
      </S.StartList>
    </S.Container>
  )
}
