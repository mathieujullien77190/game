import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { serializeLevel } from "./helpers";
import * as S from "./UI";

export const JsonTab = () => {
  const { lines, starts, arrivals, switches, balls, linkActive, clearLines } = useStore(
    useShallow((s) => ({
      lines: s.lines,
      starts: s.starts,
      arrivals: s.arrivals,
      switches: s.switches,
      balls: s.balls,
      linkActive: s.linkActive,
      clearLines: s.clearLines,
    })),
  );

  const json = serializeLevel(lines, starts, arrivals, switches, balls, linkActive);

  return (
    <S.Wrapper>
      <S.Textarea readOnly value={json} />
      <S.ClearButton onClick={clearLines}>clear</S.ClearButton>
    </S.Wrapper>
  );
};
