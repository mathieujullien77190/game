import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { PALETTE } from "engine/colors";
import ItemRow from "components/ItemRow";
import Button from "components/ui/Button";
import { Field } from "components/form/Field";
import { NumberInput } from "components/form/NumberInput";
import { ColorPicker } from "components/form/ColorPicker";
import * as S from "./UI";

export const TokenTab = () => {
  const { tokens, addToken, removeToken, setTokenColor, setTokenSpeed, setTokenShape } = useStore(
    useShallow((s) => ({
      tokens: s.tokens,
      addToken: s.addToken,
      removeToken: s.removeToken,
      setTokenColor: s.setTokenColor,
      setTokenSpeed: s.setTokenSpeed,
      setTokenShape: s.setTokenShape,
    })),
  );

  return (
    <S.Wrapper>
      <Button color="#1e293b" onClick={addToken}>
        Add Token
      </Button>
      <S.TokenList>
        {tokens.length === 0 && <S.Empty>No tokens</S.Empty>}
        {tokens.map((token, index) => (
          <ItemRow key={token.id} onDelete={() => removeToken(index)}>
            <S.TokenContent>
              <S.TokenHeader>
                <S.TokenPreview $color={token.color} $shape={token.shape} />
                <S.TokenId>{token.id}</S.TokenId>
              </S.TokenHeader>
              <S.Hr />
              <ColorPicker
                palette={PALETTE}
                value={token.color}
                onChange={(color) => setTokenColor(index, color)}
              />
              <NumberInput
                label="speed"
                value={token.speed}
                min={1}
                step={1}
                onChange={(v) => setTokenSpeed(index, v)}
              />
              <Field label="shape">
                <S.ShapeRow>
                  <S.ShapeTag $active={token.shape === "circle"} onClick={() => setTokenShape(index, "circle")}>circle</S.ShapeTag>
                  <S.ShapeTag $active={token.shape === "square"} onClick={() => setTokenShape(index, "square")}>square</S.ShapeTag>
                  <S.ShapeTag $active={token.shape === "triangle"} onClick={() => setTokenShape(index, "triangle")}>triangle</S.ShapeTag>
                </S.ShapeRow>
              </Field>
            </S.TokenContent>
          </ItemRow>
        ))}
      </S.TokenList>
    </S.Wrapper>
  );
};
