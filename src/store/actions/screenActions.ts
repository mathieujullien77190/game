import type { Set } from "store/types"
import { syncSwitches } from "./lineActions"

export const createScreenActions = (set: Set) => ({
  addScreen: () =>
    set((state) => {
      const idx = state.screens.filter((s) => s !== "main").length + 1
      const id = `screen${idx}`
      return { screens: [...state.screens, id], currentScreenId: id }
    }),

  setCurrentScreen: (id: string) => set(() => ({ currentScreenId: id })),

  removeScreen: (id: string) =>
    set((state) => {
      if (id === "main") return {}

      const lines = state.editorManager.data.lines
      const lineIds = new Set(Object.keys(lines).filter((lid) => lines[lid].screenId === id))

      for (const lid of lineIds) state.editorManager.removeLine(lid)

      const switches = syncSwitches(state.switches, state.editorManager.data.links)

      const starts = Object.fromEntries(
        Object.entries(state.starts).filter(([, s]) => !lineIds.has(s.lineId))
      )
      const arrival = state.arrival && lineIds.has(state.arrival.lineId) ? null : state.arrival
      const transformers = Object.fromEntries(
        Object.entries(state.transformers).filter(([, tr]) => tr.screenId !== id)
      )
      const inverters = Object.fromEntries(
        Object.entries(state.inverters).filter(([, inv]) => inv.screenId !== id)
      )
      const screenGates = Object.fromEntries(
        Object.entries(state.screenGates).filter(([, sg]) => sg.screenId !== id)
      )
      const { [id]: _mult, ...screenTimeMultipliers } = state.screenTimeMultipliers

      const screens = state.screens.filter((s) => s !== id)
      const currentScreenId = state.currentScreenId === id ? "main" : state.currentScreenId

      return {
        screens, currentScreenId, switches, starts, arrival,
        transformers, inverters, screenGates, screenTimeMultipliers,
        revision: state.revision + 1,
      }
    }),

  setScreenTimeMultiplier: (id: string, mult: number) =>
    set((state) => ({ screenTimeMultipliers: { ...state.screenTimeMultipliers, [id]: mult } })),
})
