import { useShallow } from "zustand/react/shallow"
import { NumberInput } from "components/form/NumberInput"
import { useStore } from "store"
import * as S from "./UI"

export const StartTab = () => {
  const { revision, start, mode, setMode, setStart, updateStartDelay } = useStore(
    useShallow((s) => ({
      revision: s.revision,
      start: s.start,
      mode: s.mode,
      setMode: s.setMode,
      setStart: s.setStart,
      updateStartDelay: s.updateStartDelay,
    }))
  )

  const isPlacing = mode === "addStart"

  return (
    <S.Container>
      {!start && (
        <S.AddButton
          $active={isPlacing}
          onClick={() => setMode(isPlacing ? "select" : "addStart")}
        >
          {isPlacing ? "Cancel" : "+ Add Start"}
        </S.AddButton>
      )}

      {start && (
        <S.StartCard key={revision}>
          <S.StartHeader>
            <S.StartInfo>{start.lineId} [{start.endpoint}]</S.StartInfo>
            <S.RemoveButton onClick={() => { setStart(null); if (isPlacing) setMode("select") }}>✕</S.RemoveButton>
          </S.StartHeader>
          <S.Divider />
          <NumberInput
            label="Delay (s)"
            value={start.delay}
            onChange={updateStartDelay}
          />
        </S.StartCard>
      )}
    </S.Container>
  )
}
