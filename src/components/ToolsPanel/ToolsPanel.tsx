import { useState } from "react"
import * as S from "./UI"
import LineTab from "components/tabs/LineTab"
import TokenTab from "components/tabs/TokenTab"
import StartTab from "components/tabs/StartTab"
import SwitchTab from "components/tabs/SwitchTab"
import TransformerTab from "components/tabs/TransformerTab"
import ArrivalTab from "components/tabs/ArrivalTab"
import InverterTab from "components/tabs/InverterTab"
import JsonTab from "components/tabs/JsonTab"

const TABS = ["line", "token", "start", "switch", "transformer", "inverter", "arrival", "json"] as const
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
        {activeTab === "transformer" && <TransformerTab />}
        {activeTab === "inverter" && <InverterTab />}
        {activeTab === "arrival" && <ArrivalTab />}
        {activeTab === "json" && <JsonTab />}
      </S.TabContent>
    </S.Container>
  )
}
