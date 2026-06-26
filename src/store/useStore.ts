import { create } from "zustand"
import { persist } from "zustand/middleware"
import { EditorManager } from "engine/Manager/EditorManager"
import { PreviewManager } from "engine/Manager/PreviewManager"
import type { LineType } from "engine/Line/Line"
import type { Store } from "./types"
import { createLineActions } from "./actions/lineActions"
import { createLinkActions } from "./actions/linkActions"
import { createTokenActions } from "./actions/tokenActions"
import { createModeActions } from "./actions/modeActions"
import { createStartActions } from "./actions/startActions"
import { createSwitchActions } from "./actions/switchActions"
import { createTransformerActions } from "./actions/transformerActions"
import { createArrivalActions } from "./actions/arrivalActions"
import { createInverterActions } from "./actions/inverterActions"
import { createScreenActions } from "./actions/screenActions"
import { createScreenGateActions } from "./actions/screenGateActions"
import { serializeMap, deserializeMap, type MapJson } from "./mapJson"

const EMPTY_MAP: MapJson = { lines: [], links: [], tokens: [], starts: [], switches: {} }

const editorManager = new EditorManager()
const previewManager = new PreviewManager()
;(window as any).previewManager = previewManager

const mapStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name)
    if (!str) return { state: EMPTY_MAP, version: 0 }
    try {
      return { state: JSON.parse(str) as MapJson, version: 0 }
    } catch {
      return { state: EMPTY_MAP, version: 0 }
    }
  },
  setItem: (name: string, value: { state: unknown }) => {
    localStorage.setItem(name, JSON.stringify(value.state))
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name)
  },
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      editorManager,
      previewManager,
      tokens: {},
      starts: {},
      switches: {},
      switchLinks: {},
      transformers: {},
      inverters: {},
      screenGates: {},
      arrival: null,
      hoveredLineId: null,
      hoveredSwitchId: null,
      hoveredTransformerId: null,
      hoveredInverterId: null,
      hoveredScreenGateId: null,
      revision: 0,
      mode: "select",
      viewMode: "editor",
      pendingPoint: null,
      pendingTransformerType: "color" as const,
      lineType: "straight" as LineType,
      linePreset: null as ("arc" | null),
      screens: ["main"],
      currentScreenId: "main",
      screenTimeMultipliers: {},
      ...createLineActions(set),
      ...createLinkActions(set),
      ...createTokenActions(set),
      ...createModeActions(set),
      ...createStartActions(set),
      ...createSwitchActions(set),
      ...createTransformerActions(set),
      ...createArrivalActions(set),
      ...createInverterActions(set),
      ...createScreenGateActions(set),
      ...createScreenActions(set),
    }),
    {
      name: "game2-map",
      storage: mapStorage as any,
      partialize: (state) =>
        serializeMap(state.editorManager, state.tokens, state.starts, state.switches, state.switchLinks, state.transformers, state.arrival, state.inverters, state.screens, state.screenGates, state.screenTimeMultipliers) as any,
      merge: (persisted, current) => {
        const json = persisted as MapJson
        const { tokens, starts, switches, switchLinks, transformers, inverters, arrival, screens, screenGates, screenTimeMultipliers } = deserializeMap(json, current.editorManager)
        return { ...current, tokens, starts, switches, switchLinks, transformers, inverters, arrival, screens, screenGates, screenTimeMultipliers, currentScreenId: "main", revision: 1 }
      },
    }
  )
)
