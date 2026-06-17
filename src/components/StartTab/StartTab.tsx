import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { COLORS } from "engine/colors";
import ItemRow from "components/ItemRow";
import { Tag } from "components/Tag";
import Button from "components/Button";
import * as S from "./UI";

export const StartTab = () => {
  const { starts, mode, setMode, removeStart, setHoveredStartId } = useStore(
    useShallow((s) => ({
      starts: s.starts,
      mode: s.mode,
      setMode: s.setMode,
      removeStart: s.removeStart,
      setHoveredStartId: s.setHoveredStartId,
    }))
  );

  return (
    <S.Wrapper>
      <Button
        color={mode === "addStart" ? "#ef4444" : COLORS.departure}
        onClick={() => setMode(mode === "addStart" ? "idle" : "addStart")}
      >
        {mode === "addStart" ? "Cancel" : "Add Start"}
      </Button>
      <S.StartList>
        {starts.length === 0 && <S.Empty>No spawn points</S.Empty>}
        {starts.map((s, index) => (
          <ItemRow
            key={s.id}
            onDelete={() => removeStart(index)}
            onMouseEnter={() => setHoveredStartId(s.id)}
            onMouseLeave={() => setHoveredStartId(null)}
          >
            <S.StartInfo>
              <S.StartId>{s.id}</S.StartId>
              <Tag color={COLORS.departureBorder} bg="#fef3c7">
                {s.position.id} [{s.position.anchor}]
              </Tag>
            </S.StartInfo>
          </ItemRow>
        ))}
      </S.StartList>
    </S.Wrapper>
  );
};
