import { useShallow } from "zustand/react/shallow"
import { Token, TOKEN_COLORS, type TokenColor, type TokenType } from "engine/Token/Token"
import { ColorPicker } from "components/form/ColorPicker"
import { NumberInput } from "components/form/NumberInput"
import { useStore } from "store"
import * as S from "./UI"

export const TokenTab = () => {
  const { tokens, addToken, removeToken, updateToken } = useStore(
    useShallow((s) => ({
      tokens: s.tokens,
      addToken: s.addToken,
      removeToken: s.removeToken,
      updateToken: s.updateToken,
    }))
  )

  return (
    <S.Container>
      <S.AddButton onClick={() => addToken(new Token(TOKEN_COLORS[0], 1))}>
        + Add Token
      </S.AddButton>

      <S.TokenList>
        {Object.values(tokens).map((token) => (
          <S.TokenCard key={token.id}>
            <S.TokenHeader>
              <S.TokenIdRow>
                <S.TokenShape $color={token.color} $round={token.type === "round"} />
                <S.TokenId>{token.id}</S.TokenId>
              </S.TokenIdRow>
              <S.DeleteButton onClick={() => removeToken(token.id)}>✕</S.DeleteButton>
            </S.TokenHeader>
            <S.Divider />
            <S.Fields>
              <S.FieldRow>
                <S.FieldLabel>Type</S.FieldLabel>
                <S.TypeToggle>
                  {(["round", "square"] as TokenType[]).map((t) => (
                    <S.TypeButton key={t} $active={token.type === t} onClick={() => updateToken(token.id, { type: t })}>
                      {t}
                    </S.TypeButton>
                  ))}
                </S.TypeToggle>
              </S.FieldRow>
              <S.FieldRow>
                <S.FieldLabel>Color</S.FieldLabel>
                <ColorPicker
                  palette={TOKEN_COLORS}
                  value={token.color}
                  onChange={(color) => updateToken(token.id, { color: color as TokenColor })}
                />
              </S.FieldRow>
              <NumberInput
                label="Speed"
                value={token.speed}
                onChange={(v) => updateToken(token.id, { speed: v })}
              />
            </S.Fields>
          </S.TokenCard>
        ))}
      </S.TokenList>
    </S.Container>
  )
}
