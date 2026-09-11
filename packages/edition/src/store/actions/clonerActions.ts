import { ClonerEditor } from "@tic-tac-tic/engine/entities/Cloner/ClonerEditor"
import type { Set } from "store/types"

export const createClonerActions = (set: Set) => ({
  addCloner: (cl: ClonerEditor) =>
    set((state) => {
      state.cloners[cl.id] = cl
      return { revision: state.revision + 1 }
    }),

  removeCloner: (id: string) =>
    set((state) => {
      const cloners = { ...state.cloners }
      delete cloners[id]
      return { cloners, revision: state.revision + 1 }
    }),

  updateClonerLinks: (id: string, linkIds: string[]) =>
    set((state) => {
      const cl = state.cloners[id]
      if (!cl) return {}
      return {
        cloners: { ...state.cloners, [id]: new ClonerEditor(cl.id, linkIds, cl.screenId) },
        revision: state.revision + 1,
      }
    }),

  setHoveredClonerId: (id: string | null) => set(() => ({ hoveredClonerId: id })),
})
