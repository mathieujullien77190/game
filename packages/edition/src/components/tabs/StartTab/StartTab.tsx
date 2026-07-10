import { useShallow } from "zustand/react/shallow"
import { NumberInput } from "components/form/NumberInput"
import { ColorPicker } from "components/form/ColorPicker"
import { TOKEN_COLORS, type TokenColor, type TokenType } from "@drift/engine/entities/Token/Token"
import { useStore } from "store"
import * as S from "./UI"

export const StartTab = () => {
  const {
    starts, mode, setMode, removeStart,
    updateStartDelay, updateStartFirstDelay,
    addTokenToStart, removeTokenFromStart, updateStartToken,
  } = useStore(
    useShallow((s) => ({
      starts: s.starts,
      mode: s.mode,
      setMode: s.setMode,
      removeStart: s.removeStart,
      updateStartDelay: s.updateStartDelay,
      updateStartFirstDelay: s.updateStartFirstDelay,
      addTokenToStart: s.addTokenToStart,
      removeTokenFromStart: s.removeTokenFromStart,
      updateStartToken: s.updateStartToken,
    }))
  )

  const isPlacing = mode === "addStart"

  return (
    <S.Container>
      <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addStart")}>
        {isPlacing ? "Cancel" : "+ Add Start"}
      </S.AddButton>

      <S.StartList>
        {Object.values(starts).map((start) => (
          <S.StartCard key={start.id}>
            <S.StartHeader>
              <S.StartInfo>{start.lineId} [{start.endpoint}]</S.StartInfo>
              <S.DeleteButton onClick={() => removeStart(start.id)}>✕</S.DeleteButton>
            </S.StartHeader>
            <S.Divider />
            <NumberInput
              label="First delay (s)"
              value={start.firstDelay}
              min={0}
              onChange={(v) => updateStartFirstDelay(start.id, v)}
            />
            <NumberInput
              label="Delay (s)"
              value={start.delay}
              min={1}
              onChange={(v) => updateStartDelay(start.id, v)}
            />
            <S.Divider />
            <S.TokenSectionHeader>
              <S.TokenSectionLabel>Tokens</S.TokenSectionLabel>
              <S.AddTokenButton onClick={() => addTokenToStart(start.id)}>+</S.AddTokenButton>
            </S.TokenSectionHeader>
            {start.tokens.map((token) => (
              <S.TokenCard key={token.id}>
                <S.TokenHeader>
                  <S.TokenShape $color={token.color} $round={token.type === "round"} />
                  <S.TokenId>{token.id}</S.TokenId>
                  <S.DeleteButton onClick={() => removeTokenFromStart(start.id, token.id)}>✕</S.DeleteButton>
                </S.TokenHeader>
                <S.TypeToggle>
                  {(["round", "square"] as TokenType[]).map((t) => (
                    <S.TypeButton key={t} $active={token.type === t} onClick={() => updateStartToken(start.id, token.id, { type: t })}>
                      {t}
                    </S.TypeButton>
                  ))}
                </S.TypeToggle>
                <ColorPicker
                  palette={TOKEN_COLORS}
                  value={token.color as TokenColor}
                  onChange={(color) => updateStartToken(start.id, token.id, { color: color as TokenColor })}
                />
                <NumberInput
                  label="Speed"
                  value={token.speed}
                  onChange={(v) => updateStartToken(start.id, token.id, { speed: v })}
                />
              </S.TokenCard>
            ))}
          </S.StartCard>
        ))}
      </S.StartList>
    </S.Container>
  )
}
