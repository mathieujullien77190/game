import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import * as S from "./UI"

export const FaderTab = () => {
  const { faders, revision: _revision, mode, setMode, removeFader, setHoveredFaderId, updateFaderAmount } = useStore(
    useShallow((s) => ({
      faders: s.faders,
      revision: s.revision,
      mode: s.mode,
      setMode: s.setMode,
      removeFader: s.removeFader,
      setHoveredFaderId: s.setHoveredFaderId,
      updateFaderAmount: s.updateFaderAmount,
    }))
  )

  const isPlacing = mode === "addFader"

  return (
    <S.Container>
      <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addFader")}>
        {isPlacing ? "Cancel" : "+ Add Fader"}
      </S.AddButton>
      <S.FaderList>
        {Object.values(faders).map((f) => (
          <S.FaderCard
            key={f.id}
            onMouseEnter={() => setHoveredFaderId(f.id)}
            onMouseLeave={() => setHoveredFaderId(null)}
          >
            <S.Row>
              <S.FaderId>{f.id}</S.FaderId>
              <S.Row>
                <S.AmountLabel>opacity</S.AmountLabel>
                <S.AmountInput
                  type="number"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={f.amount}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    if (!isNaN(v)) updateFaderAmount(f.id, Math.min(1, Math.max(0.05, v)))
                  }}
                />
                <S.DeleteButton onClick={() => removeFader(f.id)}>✕</S.DeleteButton>
              </S.Row>
            </S.Row>
          </S.FaderCard>
        ))}
      </S.FaderList>
    </S.Container>
  )
}
