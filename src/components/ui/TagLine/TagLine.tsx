import { createContext, useContext } from "react";
import { useStore } from "store/useStore";
import * as S from "./UI";

export const LineHoverCtx = createContext<string | null>(null);

type Props = {
  lineId: string;
  anchor?: "start" | "end";
  onClick?: () => void;
  active?: boolean;
  large?: boolean;
  muted?: boolean;
  selected?: boolean;
};

export const TagLine = ({ lineId, anchor, onClick, active, large, muted, selected }: Props) => {
  const setHoveredLineId = useStore((s) => s.setHoveredLineId);
  const parentLineId = useContext(LineHoverCtx);

  return (
    <S.Chip
      $clickable={!!onClick}
      $inactive={active === false}
      $large={large}
      $muted={muted}
      $selected={selected}
      onClick={onClick}
      onMouseEnter={() => setHoveredLineId(lineId)}
      onMouseLeave={() => setHoveredLineId(parentLineId)}
    >
      {lineId}{anchor ? ` [${anchor}]` : ""}
    </S.Chip>
  );
};
