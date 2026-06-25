import { Fader, syncFaderCounter } from "engine/Fader/Fader"
import type { Set } from "store/types"

export const createFaderActions = (set: Set) => ({
  addFader: (linkId: string) =>
    set((state) => {
      const fader = new Fader(linkId)
      return { faders: { ...state.faders, [fader.id]: fader }, revision: state.revision + 1 }
    }),

  removeFader: (id: string) =>
    set((state) => {
      const { [id]: _, ...rest } = state.faders
      return { faders: rest, revision: state.revision + 1 }
    }),

  setHoveredFaderId: (id: string | null) => set(() => ({ hoveredFaderId: id })),

  updateFaderAmount: (id: string, amount: number) =>
    set((state) => {
      const fader = state.faders[id]
      if (!fader) return {}
      fader.amount = amount
      return { revision: state.revision + 1 }
    }),
})

export const syncFaders = (faders: Record<string, Fader>) => {
  syncFaderCounter(Object.keys(faders))
}
