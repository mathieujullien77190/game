import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { PALETTE } from "engine/colors";
import ItemRow from "components/ItemRow";
import Button from "components/ui/Button";
import { NumberInput } from "components/form/NumberInput";
import { ColorPicker } from "components/form/ColorPicker";
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
              <ColorPicker
                palette={PALETTE}
                value={ball.color}
                onChange={(color) => setBallColor(index, color)}
              />
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
