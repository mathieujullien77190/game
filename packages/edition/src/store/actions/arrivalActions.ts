import { ArrivalEditor } from "@drift/engine/entities/Arrival/ArrivalEditor"
import { makeDemand, type QueueSide } from "@drift/engine/entities/Arrival/Arrival"
import type { TokenColor, TokenType } from "@drift/engine/entities/Token/Token"
import type { Set } from "store/types"

export const createArrivalActions = (set: Set) => ({
  addArrival: (lineId: string, endpoint: "start" | "end") =>
    set((state) => {
      const a = new ArrivalEditor(lineId, endpoint, undefined, [], state.currentScreenId)
      return { arrivals: { ...state.arrivals, [a.id]: a }, revision: state.revision + 1 }
    }),

  removeArrival: (id: string) =>
    set((state) => {
      const arrivals = { ...state.arrivals }
      delete arrivals[id]
      return { arrivals, revision: state.revision + 1 }
    }),

  addArrivalDemand: (arrivalId: string) =>
    set((state) => {
      const a = state.arrivals[arrivalId]
      if (!a) return {}
      a.demands = [...a.demands, makeDemand()]
      return { revision: state.revision + 1 }
    }),

  removeArrivalDemand: (arrivalId: string, id: string) =>
    set((state) => {
      const a = state.arrivals[arrivalId]
      if (!a) return {}
      a.demands = a.demands.filter((d) => d.id !== id)
      return { revision: state.revision + 1 }
    }),

  updateArrivalDemand: (arrivalId: string, id: string, patch: { color?: TokenColor; type?: TokenType; angled?: boolean }) =>
    set((state) => {
      const a = state.arrivals[arrivalId]
      if (!a) return {}
      a.demands = a.demands.map((d) =>
        d.id === id ? { ...d, ...patch } : d
      )
      return { revision: state.revision + 1 }
    }),

  setArrivalQueueSide: (arrivalId: string, queueSide: QueueSide) =>
    set((state) => {
      const a = state.arrivals[arrivalId]
      if (!a) return {}
      a.queueSide = queueSide
      return { revision: state.revision + 1 }
    }),
})
