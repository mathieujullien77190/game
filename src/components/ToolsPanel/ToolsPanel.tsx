import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import LineTab from "components/LineTab";
import StartTab from "components/StartTab";
import BallTab from "components/BallTab";
import { useStore } from "store/useStore";
import type { Tab } from "./types";
import { serializeLevel } from "./helpers";
import * as S from "./UI";

const TABS: { id: Tab; label: string }[] = [
  { id: "line", label: "Line" },
  { id: "start", label: "Start" },
  { id: "ball", label: "Ball" },
  { id: "json", label: "JSON" },
];

export const ToolsPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>("line");

  const { lines, starts, balls, linkActive, clearLines } = useStore(
    useShallow((s) => ({
      lines: s.lines,
      starts: s.starts,
      balls: s.balls,
      linkActive: s.linkActive,
      clearLines: s.clearLines,
    }))
  );

  const json = serializeLevel(lines, starts, balls, linkActive);

  return (
    <S.Wrapper>
      <S.TabBar>
        {TABS.map((tab) => (
          <S.Tab
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </S.Tab>
        ))}
      </S.TabBar>
      <S.Content>
        {activeTab === "line" && <LineTab />}
        {activeTab === "start" && <StartTab />}
        {activeTab === "ball" && <BallTab />}
        {activeTab === "json" && (
          <S.JsonWrapper>
            <S.JsonTextarea readOnly value={json} />
            <S.ClearButton onClick={clearLines}>clear</S.ClearButton>
          </S.JsonWrapper>
        )}
      </S.Content>
    </S.Wrapper>
  );
};
