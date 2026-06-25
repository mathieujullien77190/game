import { Inverter, syncInverterCounter } from "engine/Inverter/Inverter"
import type { Set } from "store/types"

export const createInverterActions = (set: Set) => ({
  addInverter: (linkId: string) =>
    set((state) => {
      const inv = new Inverter(linkId)
      return { inverters: { ...state.inverters, [inv.id]: inv }, revision: state.revision + 1 }
    }),

  removeInverter: (id: string) =>
    set((state) => {
      const { [id]: _, ...rest } = state.inverters
      return { inverters: rest, revision: state.revision + 1 }
    }),

  setHoveredInverterId: (id: string | null) => set(() => ({ hoveredInverterId: id })),
})

export const syncInverters = (inverters: Record<string, Inverter>) => {
  syncInverterCounter(Object.keys(inverters))
}
