import { useShallow } from "zustand/react/shallow"
import { NumberInput } from "components/form/NumberInput"
import { ColorPicker } from "components/form/ColorPicker"
import { Field } from "components/form/Field"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { DeleteButton } from "components/ui/DeleteButton"
import { Card } from "components/ui/Card"
import { Divider } from "components/ui/Divider"
import { TokenShape } from "components/ui/TokenShape"
import { TOKEN_COLORS, ANGLED_LABEL, type TokenColor, type TokenType } from "@drift/engine/entities/Token/Token"
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
      <Button $active={isPlacing} $accent="#333" $full onClick={() => setMode(isPlacing ? "select" : "addStart")}>
        {isPlacing ? "Cancel" : "+ Add Start"}
      </Button>

      <S.StartList>
        {Object.values(starts).map((start) => (
          <Card key={start.id}>
            <S.StartHeader>
              <S.StartInfo>{start.lineId} [{start.endpoint}]</S.StartInfo>
              <DeleteButton onClick={() => removeStart(start.id)} />
            </S.StartHeader>
            <Divider />
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
            <Divider />
            <S.TokenSectionHeader>
              <S.TokenSectionLabel>Tokens</S.TokenSectionLabel>
              <S.AddTokenButton onClick={() => addTokenToStart(start.id)}>+</S.AddTokenButton>
            </S.TokenSectionHeader>
            {start.tokens.map((token) => (
              <Card key={token.id} $nested>
                <S.TokenHeader>
                  <TokenShape $color={token.color} $shape={token.type} />
                  <S.TokenId>{token.id}</S.TokenId>
                  <DeleteButton onClick={() => removeTokenFromStart(start.id, token.id)} />
                </S.TokenHeader>
                <Divider />
                <Field label="Type" $direction="row">
                  <ToggleGroup>
                    {(["round", "square", "triangle"] as TokenType[]).map((t) => (
                      <Button key={t} $size="sm" $accent="#333" $active={token.type === t} onClick={() => updateStartToken(start.id, token.id, { type: t })}>
                        {t}
                      </Button>
                    ))}
                  </ToggleGroup>
                </Field>
                <Field label="Color" $direction="row">
                  <ColorPicker
                    palette={TOKEN_COLORS}
                    value={token.color as TokenColor}
                    onChange={(color) => updateStartToken(start.id, token.id, { color: color as TokenColor })}
                  />
                </Field>
                <NumberInput
                  label="Speed"
                  value={token.speed}
                  onChange={(v) => updateStartToken(start.id, token.id, { speed: v })}
                />
                {ANGLED_LABEL[token.type as TokenType] && (
                  <Field label="Angle" $direction="row">
                    <ToggleGroup>
                      <Button $size="sm" $accent="#333" $active={!token.angled} onClick={() => updateStartToken(start.id, token.id, { angled: false })}>0°</Button>
                      <Button $size="sm" $accent="#333" $active={!!token.angled} onClick={() => updateStartToken(start.id, token.id, { angled: true })}>{ANGLED_LABEL[token.type as TokenType]}</Button>
                    </ToggleGroup>
                  </Field>
                )}
              </Card>
            ))}
          </Card>
        ))}
      </S.StartList>
    </S.Container>
  )
}
