import { useStore } from "store/useStore";
import * as S from "./UI";

type Props = {
  linkId: string;
  onClick?: () => void;
  active?: boolean;
  muted?: boolean;
};

export const TagLink = ({ linkId, onClick, active, muted }: Props) => {
  const setHoveredLinkId = useStore((s) => s.setHoveredLinkId);

  return (
    <S.Chip
      $clickable={!!onClick}
      $inactive={active === false}
      $muted={muted}
      onClick={onClick}
      onMouseEnter={() => setHoveredLinkId(linkId)}
      onMouseLeave={() => setHoveredLinkId(null)}
    >
      {linkId}
    </S.Chip>
  );
};
