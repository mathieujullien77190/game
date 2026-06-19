import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import ItemRow from "components/ItemRow";
import Button from "components/ui/Button";
import * as S from "./UI";

export const BoxTab = () => {
  const { boxes, addBox, removeBox } = useStore(
    useShallow((s) => ({
      boxes: s.boxes,
      addBox: s.addBox,
      removeBox: s.removeBox,
    })),
  );

  return (
    <S.Wrapper>
      <Button color="#6366f1" onClick={addBox}>
        Add Box
      </Button>
      <S.BoxList>
        {boxes.length === 0 && <S.Empty>No boxes</S.Empty>}
        {boxes.map((box, index) => (
          <ItemRow key={box.id} onDelete={() => removeBox(index)}>
            <S.BoxId>{box.id}</S.BoxId>
          </ItemRow>
        ))}
      </S.BoxList>
    </S.Wrapper>
  );
};
