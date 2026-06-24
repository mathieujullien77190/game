import { Painter, syncPainterCounter } from "engine/Painter/Painter"
import type { Set } from "store/types"

export const createPainterActions = (set: Set) => ({
  addPainter: (linkId: string) =>
    set((state) => {
      const p = new Painter(linkId)
      return { painters: { ...state.painters, [p.id]: p }, revision: state.revision + 1 }
    }),

  removePainter: (id: string) =>
    set((state) => {
      const { [id]: _, ...rest } = state.painters
      return { painters: rest, revision: state.revision + 1 }
    }),

  setPainterColor: (id: string, color: string) =>
    set((state) => {
      const p = state.painters[id]
      if (!p) return {}
      return { painters: { ...state.painters, [id]: new Painter(p.linkId, color, p.id) }, revision: state.revision + 1 }
    }),

  setHoveredPainterId: (id: string | null) => set(() => ({ hoveredPainterId: id })),
})

export const syncPainters = (painters: Record<string, Painter>) => {
  syncPainterCounter(Object.keys(painters))
}
