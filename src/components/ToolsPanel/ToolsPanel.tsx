import { useState } from "react";
import LineTab from "components/tabs/LineTab";
import StartTab from "components/tabs/StartTab";
import ArrivalTab from "components/tabs/ArrivalTab";
import SwitchTab from "components/tabs/SwitchTab";
import PainterTab from "components/tabs/PainterTab";
import TokenTab from "components/tabs/TokenTab";
import ScreenTab from "components/tabs/ScreenTab";
import JsonTab from "components/tabs/JsonTab";
import type { Tab } from "./types";
import * as S from "./UI";

const TABS: { id: Tab; label: string }[] = [
  { id: "line", label: "Line" },
  { id: "start", label: "Start" },
  { id: "arrival", label: "Arrival" },
  { id: "switch", label: "Switch" },
  { id: "painter", label: "Painter" },
  { id: "token", label: "Token" },
  { id: "screen", label: "Screen" },
  { id: "json", label: "JSON" },
];

export const ToolsPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>("line");

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
        {activeTab === "arrival" && <ArrivalTab />}
        {activeTab === "switch" && <SwitchTab />}
        {activeTab === "painter" && <PainterTab />}
        {activeTab === "token" && <TokenTab />}
        {activeTab === "screen" && <ScreenTab />}
        {activeTab === "json" && <JsonTab />}
      </S.Content>
    </S.Wrapper>
  );
};
