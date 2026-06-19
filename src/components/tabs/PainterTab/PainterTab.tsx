import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { PALETTE } from "engine/colors";
import ItemRow from "components/ItemRow";
import Button from "components/ui/Button";
import { Tag } from "components/ui/Tag";
import { TagLine } from "components/ui/TagLine";
import { ColorPicker } from "components/form/ColorPicker";
import * as S from "./UI";

export const PainterTab = () => {
  const {
    painters,
    mode,
    setMode,
    removePainter,
    setPainterColor,
    setHoveredPainterId,
  } = useStore(
    useShallow((s) => ({
      painters: s.painters,
      mode: s.mode,
      setMode: s.setMode,
      removePainter: s.removePainter,
      setPainterColor: s.setPainterColor,
      setHoveredPainterId: s.setHoveredPainterId,
    })),
  );

  return (
    <S.Wrapper>
      <Button
        color={mode === "addPainter" ? "#ef4444" : "#ec4899"}
        onClick={() => setMode(mode === "addPainter" ? "idle" : "addPainter")}
      >
        {mode === "addPainter" ? "Cancel" : "Add Painter"}
      </Button>
      <S.PainterList>
        {painters.length === 0 && <S.Empty>No painters</S.Empty>}
        {painters.map((p, index) => (
          <ItemRow
            key={p.id}
            onDelete={() => removePainter(index)}
            onMouseEnter={() => setHoveredPainterId(p.id)}
            onMouseLeave={() => setHoveredPainterId(null)}
          >
            <S.PainterInfo>
              <S.PainterHeader>
                <S.PainterId>{p.id}</S.PainterId>
                <Tag color="#6366f1" bg="#eef2ff" large>{p.screenId ?? "mainScreen"}</Tag>
                <TagLine lineId={p.input.id} anchor={p.input.anchor} selected={false} />
              </S.PainterHeader>
              <S.Hr />
              <ColorPicker
                label="Couleur cible"
                palette={[...PALETTE]}
                value={p.color}
                onChange={(color) => setPainterColor(index, color)}
              />
            </S.PainterInfo>
          </ItemRow>
        ))}
      </S.PainterList>
    </S.Wrapper>
  );
};
