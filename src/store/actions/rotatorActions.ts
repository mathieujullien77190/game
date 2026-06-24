import { Rotator, syncRotatorCounter } from "engine/Rotator/Rotator"
import type { Set } from "store/types"

export const createRotatorActions = (set: Set) => ({
  addRotator: (linkId: string) =>
    set((state) => {
      const rot = new Rotator(linkId)
      return { rotators: { ...state.rotators, [rot.id]: rot }, revision: state.revision + 1 }
    }),

  removeRotator: (id: string) =>
    set((state) => {
      const { [id]: _, ...rest } = state.rotators
      return { rotators: rest, revision: state.revision + 1 }
    }),

  setHoveredRotatorId: (id: string | null) => set(() => ({ hoveredRotatorId: id })),
})

export const syncRotators = (rotators: Record<string, Rotator>) => {
  syncRotatorCounter(Object.keys(rotators))
}
