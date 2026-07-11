import { useShallow } from "zustand/react/shallow"
import { NumberInput } from "components/form/NumberInput"
import { ColorPicker } from "components/form/ColorPicker"
import { Field } from "components/form/Field"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { Box } from "components/ui/Box"
import { Divider } from "components/ui/Divider"
import { TokenShape } from "components/ui/TokenShape"
import { TOKEN_COLORS, ANGLED_LABEL, TYPE_GLYPH, type TokenColor, type TokenType } from "@drift/engine/entities/Token/Token"
import { useStore } from "store"
import * as S from "./UI"

export const StartTab = () => {
  const {
    starts, mode, currentScreenId, setMode, removeStart,
    updateStartDelay, updateStartFirstDelay,
    addTokenToStart, removeTokenFromStart, updateStartToken, setHoveredStartId,
  } = useStore(
    useShallow((s) => ({
      starts: s.starts,
      mode: s.mode,
      currentScreenId: s.currentScreenId,
      setMode: s.setMode,
      removeStart: s.removeStart,
      updateStartDelay: s.updateStartDelay,
      updateStartFirstDelay: s.updateStartFirstDelay,
      addTokenToStart: s.addTokenToStart,
      removeTokenFromStart: s.removeTokenFromStart,
      updateStartToken: s.updateStartToken,
      setHoveredStartId: s.setHoveredStartId,
    }))
  )

  const isPlacing = mode === "addStart"
  const startsForScreen = Object.values(starts).filter((start) => start.screenId === currentScreenId)

  return (
    <S.Container>
      <Button $active={isPlacing} $accent="#333" $full onClick={() => setMode(isPlacing ? "select" : "addStart")}>
        {isPlacing ? "Cancel" : "+ Add Start"}
      </Button>

      <S.StartList>
        {startsForScreen.map((start) => (
          <Box
            key={start.id}
            id={start.id}
            screenId={start.screenId}
            onDelete={() => removeStart(start.id)}
            onMouseEnter={() => setHoveredStartId(start.id)}
            onMouseLeave={() => setHoveredStartId(null)}
          >
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
              <Box
                key={token.id}
                id={token.id}
                leading={<TokenShape $color={token.color} $shape={token.type} />}
                nested
                onDelete={() => removeTokenFromStart(start.id, token.id)}
              >
                <Field label="Type" $direction="row">
                  <ToggleGroup>
                    {(["round", "square", "triangle"] as TokenType[]).map((t) => (
                      <Button key={t} $size="sm" $accent="#333" $active={token.type === t} onClick={() => updateStartToken(start.id, token.id, { type: t })}>
                        {TYPE_GLYPH[t]}
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
              </Box>
            ))}
          </Box>
        ))}
      </S.StartList>
    </S.Container>
  )
}
