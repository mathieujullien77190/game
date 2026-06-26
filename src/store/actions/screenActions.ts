import type { Set } from "store/types"

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
      const screens = state.screens.filter((s) => s !== id)
      const currentScreenId = state.currentScreenId === id ? "main" : state.currentScreenId
      return { screens, currentScreenId }
    }),

  setScreenTimeMultiplier: (id: string, mult: number) =>
    set((state) => ({ screenTimeMultipliers: { ...state.screenTimeMultipliers, [id]: mult } })),
})
