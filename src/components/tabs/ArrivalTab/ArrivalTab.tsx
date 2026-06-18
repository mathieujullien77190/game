import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { COLORS } from "engine/colors";
import ItemRow from "components/ItemRow";
import { Tag } from "components/ui/Tag";
import Button from "components/ui/Button";
import * as S from "./UI";

export const ArrivalTab = () => {
  const {
    arrivals,
    mode,
    setMode,
    removeArrival,
    setHoveredArrivalId,
  } = useStore(
    useShallow((s) => ({
      arrivals: s.arrivals,
      mode: s.mode,
      setMode: s.setMode,
      removeArrival: s.removeArrival,
      setHoveredArrivalId: s.setHoveredArrivalId,
    })),
  );

  return (
    <S.Wrapper>
      <Button
        color={mode === "addArrival" ? "#ef4444" : COLORS.arrival}
        onClick={() => setMode(mode === "addArrival" ? "idle" : "addArrival")}
      >
        {mode === "addArrival" ? "Cancel" : "Add Arrival"}
      </Button>
      <S.ArrivalList>
        {arrivals.length === 0 && <S.Empty>No arrival points</S.Empty>}
        {arrivals.map((a, index) => (
          <ItemRow
            key={a.id}
            onDelete={() => removeArrival(index)}
            onMouseEnter={() => setHoveredArrivalId(a.id)}
            onMouseLeave={() => setHoveredArrivalId(null)}
          >
            <S.ArrivalInfo>
              <S.ArrivalId>{a.id}</S.ArrivalId>
              <Tag color={COLORS.arrivalBorder} bg="#dcfce7">
                {a.position.id} [{a.position.anchor}]
              </Tag>
            </S.ArrivalInfo>
          </ItemRow>
        ))}
      </S.ArrivalList>
    </S.Wrapper>
  );
};
