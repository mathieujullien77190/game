import { ArrivalEditor } from "engine/Arrival/ArrivalEditor"
import { makeDemand } from "engine/Arrival/Arrival"
import type { TokenColor, TokenType } from "engine/Token/Token"
import type { Set } from "store/types"

export const createArrivalActions = (set: Set) => ({
  setArrival: (lineId: string, endpoint: "start" | "end") =>
    set((state) => ({
      arrival: new ArrivalEditor(lineId, endpoint),
      revision: state.revision + 1,
    })),

  removeArrival: () =>
    set((state) => ({ arrival: null, revision: state.revision + 1 })),

  addArrivalDemand: () =>
    set((state) => {
      if (!state.arrival) return {}
      state.arrival.demands = [...state.arrival.demands, makeDemand()]
      return { revision: state.revision + 1 }
    }),

  removeArrivalDemand: (id: string) =>
    set((state) => {
      if (!state.arrival) return {}
      state.arrival.demands = state.arrival.demands.filter((d) => d.id !== id)
      return { revision: state.revision + 1 }
    }),

  updateArrivalDemand: (id: string, patch: { color?: TokenColor; type?: TokenType; angled?: boolean }) =>
    set((state) => {
      if (!state.arrival) return {}
      state.arrival.demands = state.arrival.demands.map((d) =>
        d.id === id ? { ...d, ...patch } : d
      )
      return { revision: state.revision + 1 }
    }),
})
