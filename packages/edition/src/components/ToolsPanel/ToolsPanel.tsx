import { useState } from "react"
import * as S from "./UI"
import LineTab from "components/tabs/LineTab"
import StartTab from "components/tabs/StartTab"
import SwitchTab from "components/tabs/SwitchTab"
import ClonerTab from "components/tabs/ClonerTab"
import TransformerTab from "components/tabs/TransformerTab"
import ArrivalTab from "components/tabs/ArrivalTab"
import InverterTab from "components/tabs/InverterTab"
import JsonTab from "components/tabs/JsonTab"
import PerfTab from "components/tabs/PerfTab"
import { ScreenGateTab } from "components/tabs/ScreenGateTab/ScreenGateTab"

const TABS = ["line", "start", "switch", "cloner", "transformer", "inverter", "arrival", "gate", "json", "perf"] as const
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
        {activeTab === "start" && <StartTab />}
        {activeTab === "switch" && <SwitchTab />}
        {activeTab === "cloner" && <ClonerTab />}
        {activeTab === "transformer" && <TransformerTab />}
        {activeTab === "inverter" && <InverterTab />}
        {activeTab === "arrival" && <ArrivalTab />}
        {activeTab === "gate" && <ScreenGateTab />}
        {activeTab === "json" && <JsonTab />}
        {activeTab === "perf" && <PerfTab />}
      </S.TabContent>
    </S.Container>
  )
}
