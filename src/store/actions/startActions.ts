import { Start } from "engine/Start/Start"
import type { Set } from "store/types"

export const createStartActions = (set: Set) => ({
  setStart: (start: Start | null) =>
    set((state) => ({ start, revision: state.revision + 1 })),

  updateStartDelay: (delay: number) =>
    set((state) => {
      if (!state.start) return {}
      const s = state.start
      return {
        start: new Start(s.lineId, s.endpoint, delay),
        revision: state.revision + 1,
      }
    }),
})
