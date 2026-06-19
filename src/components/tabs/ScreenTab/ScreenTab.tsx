import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import ItemRow from "components/ItemRow";
import Button from "components/ui/Button";
import * as S from "./UI";

export const ScreenTab = () => {
  const { screens, activeScreenId, addScreen, removeScreen, setActiveScreenId } = useStore(
    useShallow((s) => ({
      screens: s.screens,
      activeScreenId: s.activeScreenId,
      addScreen: s.addScreen,
      removeScreen: s.removeScreen,
      setActiveScreenId: s.setActiveScreenId,
    })),
  );

  const handleToggle = (id: string) => {
    setActiveScreenId(activeScreenId === id ? null : id);
  };

  return (
    <S.Wrapper>
      <Button color="#6366f1" onClick={addScreen}>
        Add Screen
      </Button>
      <S.ScreenList>
        {screens.length === 0 && <S.Empty>No screens</S.Empty>}
        {screens.map((screen, index) => (
          <ItemRow key={screen.id} onDelete={() => removeScreen(index)}>
            <S.ScreenRow $active={activeScreenId === screen.id} onClick={() => handleToggle(screen.id)}>
              <S.ScreenId>{screen.id}</S.ScreenId>
              <S.ScreenHint>{activeScreenId === screen.id ? "editing ↗" : "click to edit"}</S.ScreenHint>
            </S.ScreenRow>
          </ItemRow>
        ))}
      </S.ScreenList>
    </S.Wrapper>
  );
};
