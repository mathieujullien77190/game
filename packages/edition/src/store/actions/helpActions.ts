import { Help, syncHelpCounter, type HelpArrow } from "engine/Help/Help"
import type { Set } from "store/types"

export const createHelpActions = (set: Set) => ({
  addHelp: (x: number, y: number) =>
    set((state) => {
      const h = new Help(x, y, "", "none", state.currentScreenId)
      return { helps: { ...state.helps, [h.id]: h }, selectedHelpId: h.id, revision: state.revision + 1 }
    }),

  removeHelp: (id: string) =>
    set((state) => {
      const { [id]: _, ...rest } = state.helps
      return { helps: rest, selectedHelpId: state.selectedHelpId === id ? null : state.selectedHelpId, revision: state.revision + 1 }
    }),

  updateHelp: (id: string, patch: { text?: string; arrow?: HelpArrow; x?: number; y?: number }) =>
    set((state) => ({
      helps: { ...state.helps, [id]: { ...state.helps[id], ...patch } },
      revision: state.revision + 1,
    })),

  setSelectedHelpId: (id: string | null) => set(() => ({ selectedHelpId: id })),
})

export const syncHelps = (helps: Record<string, Help>) => {
  syncHelpCounter(Object.keys(helps))
}
