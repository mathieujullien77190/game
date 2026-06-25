import { ScreenGate } from "engine/ScreenGate/ScreenGate"
import type { Set } from "store/types"

export const createScreenGateActions = (set: Set) => ({
  addScreenGate: (linkId: string) =>
    set((state) => {
      const sg = new ScreenGate(linkId, undefined, state.currentScreenId)
      return { screenGates: { ...state.screenGates, [sg.id]: sg }, revision: state.revision + 1 }
    }),

  removeScreenGate: (id: string) =>
    set((state) => {
      const { [id]: _, ...rest } = state.screenGates
      return { screenGates: rest, revision: state.revision + 1 }
    }),

  setHoveredScreenGateId: (id: string | null) => set(() => ({ hoveredScreenGateId: id })),

  updateScreenGateTargetScreen: (id: string, targetScreenId: string) =>
    set((state) => {
      const sg = state.screenGates[id]
      if (!sg) return {}
      sg.targetScreenId = targetScreenId
      sg.entryKey = ""
      sg.exitKey = ""
      return { screenGates: { ...state.screenGates }, revision: state.revision + 1 }
    }),

  updateScreenGateEntryKey: (id: string, entryKey: string) =>
    set((state) => {
      const sg = state.screenGates[id]
      if (!sg) return {}
      sg.entryKey = entryKey
      return { screenGates: { ...state.screenGates }, revision: state.revision + 1 }
    }),

  updateScreenGateExitKey: (id: string, exitKey: string) =>
    set((state) => {
      const sg = state.screenGates[id]
      if (!sg) return {}
      sg.exitKey = exitKey
      return { screenGates: { ...state.screenGates }, revision: state.revision + 1 }
    }),
})
