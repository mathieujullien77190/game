import { useState } from "react"
import * as S from "./UI"
import LineTab from "components/tabs/LineTab"
import TokenTab from "components/tabs/TokenTab"
import StartTab from "components/tabs/StartTab"
import SwitchTab from "components/tabs/SwitchTab"
import RotatorTab from "components/tabs/RotatorTab"
import PainterTab from "components/tabs/PainterTab"
import ArrivalTab from "components/tabs/ArrivalTab"
import JsonTab from "components/tabs/JsonTab"

const TABS = ["line", "token", "start", "switch", "rotator", "painter", "arrival", "json"] as const
type Tab = (typeof TABS)[number]

export const ToolsPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>("line")

  return (
    <S.Container>
      <S.TabBar>
        {TABS.map((tab) => (
          <S.TabButton
            key={tab}
            $active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </S.TabButton>
        ))}
      </S.TabBar>
      <S.TabContent>
        {activeTab === "line" && <LineTab />}
        {activeTab === "token" && <TokenTab />}
        {activeTab === "start" && <StartTab />}
        {activeTab === "switch" && <SwitchTab />}
        {activeTab === "rotator" && <RotatorTab />}
        {activeTab === "painter" && <PainterTab />}
        {activeTab === "arrival" && <ArrivalTab />}
        {activeTab === "json" && <JsonTab />}
      </S.TabContent>
    </S.Container>
  )
}
