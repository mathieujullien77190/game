import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { BALL_PALETTE } from "engine/Ball";
import ItemRow from "components/ItemRow";
import Button from "components/ui/Button";
import { NumberInput } from "components/form/NumberInput";
import * as S from "./UI";

export const BallTab = () => {
  const { balls, addBall, removeBall, setBallColor, setBallSpeed } = useStore(
    useShallow((s) => ({
      balls: s.balls,
      addBall: s.addBall,
      removeBall: s.removeBall,
      setBallColor: s.setBallColor,
      setBallSpeed: s.setBallSpeed,
    })),
  );

  return (
    <S.Wrapper>
      <Button color="#1e293b" onClick={addBall}>
        Add Ball
      </Button>
      <S.BallList>
        {balls.length === 0 && <S.Empty>No balls</S.Empty>}
        {balls.map((ball, index) => (
          <ItemRow key={ball.id} onDelete={() => removeBall(index)}>
            <S.BallContent>
              <S.BallHeader>
                <S.BallPreview $color={ball.color} />
                <S.BallId>{ball.id}</S.BallId>
              </S.BallHeader>
              <S.ColorPalette>
                {BALL_PALETTE.map((color) => (
                  <S.ColorSwatch
                    key={color}
                    type="button"
                    $color={color}
                    $selected={ball.color === color}
                    onClick={() => setBallColor(index, color)}
                  />
                ))}
              </S.ColorPalette>
              <NumberInput
                label="speed"
                value={ball.speed}
                min={1}
                step={1}
                onChange={(v) => setBallSpeed(index, v)}
              />
            </S.BallContent>
          </ItemRow>
        ))}
      </S.BallList>
    </S.Wrapper>
  );
};
