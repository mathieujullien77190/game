import { StartEditor } from "engine/Start/StartEditor"
import type { Set } from "store/types"

export const createStartActions = (set: Set) => ({
  addStart: (start: StartEditor) =>
    set((state) => {
      state.starts[start.id] = start
      return { revision: state.revision + 1 }
    }),

  removeStart: (id: string) =>
    set((state) => {
      const starts = { ...state.starts }
      delete starts[id]
      return { starts, revision: state.revision + 1 }
    }),

  updateStartDelay: (id: string, delay: number) =>
    set((state) => {
      const s = state.starts[id]
      if (!s) return {}
      return {
        starts: { ...state.starts, [id]: new StartEditor(s.lineId, s.endpoint, delay, s.id) },
        revision: state.revision + 1,
      }
    }),
})
