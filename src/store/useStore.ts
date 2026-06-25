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
import { createRotatorActions } from "./actions/rotatorActions"
import { createArrivalActions } from "./actions/arrivalActions"
import { createFaderActions } from "./actions/faderActions"
import { createInverterActions } from "./actions/inverterActions"
import { createTransformerActions } from "./actions/transformerActions"
import { serializeMap, deserializeMap, type MapJson } from "./mapJson"

const editorManager = new EditorManager()
const previewManager = new PreviewManager()
;(window as any).previewManager = previewManager

const mapStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name)
    if (!str) return null
    try {
      return { state: JSON.parse(str) as MapJson, version: 0 }
    } catch {
      return null
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
      rotators: {},
      faders: {},
      inverters: {},
      transformers: {},
      arrival: null,
      hoveredLineId: null,
      hoveredSwitchId: null,
      hoveredRotatorId: null,
      hoveredFaderId: null,
      hoveredInverterId: null,
      hoveredTransformerId: null,
      revision: 0,
      mode: "select",
      viewMode: "editor",
      pendingPoint: null,
      lineType: "straight" as LineType,
      ...createLineActions(set),
      ...createLinkActions(set),
      ...createTokenActions(set),
      ...createModeActions(set),
      ...createStartActions(set),
      ...createSwitchActions(set),
      ...createRotatorActions(set),
      ...createArrivalActions(set),
      ...createFaderActions(set),
      ...createInverterActions(set),
      ...createTransformerActions(set),
    }),
    {
      name: "game2-map",
      storage: mapStorage as any,
      partialize: (state) =>
        serializeMap(state.editorManager, state.tokens, state.starts, state.switches, state.switchLinks, state.rotators, state.arrival, state.faders, state.inverters, state.transformers) as any,
      merge: (persisted, current) => {
        const json = persisted as MapJson
        const { tokens, starts, switches, switchLinks, rotators, faders, inverters, transformers, arrival } = deserializeMap(json, current.editorManager)
        return { ...current, tokens, starts, switches, switchLinks, rotators, faders, inverters, transformers, arrival, revision: 1 }
      },
    }
  )
)
