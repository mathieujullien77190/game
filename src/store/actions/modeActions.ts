import { LinePreview } from "engine/Line/LinePreview"
import type { Point } from "engine/types"
import type { Mode, ViewMode, Set } from "store/types"

export const createModeActions = (set: Set) => ({
  setMode: (mode: Mode) => set(() => ({ mode })),

  setViewMode: (viewMode: ViewMode) =>
    set((state) => {
      if (viewMode === "preview") {
        state.previewManager.data.lines = {}
        Object.values(state.editorManager.data.lines).forEach((l) => {
          const lp = new LinePreview(l.start, l.end, l.type, l.id, l.cp1, l.cp2)
          lp.boost = l.boost
          lp.tunnel = l.tunnel
          if (l.type === "sine") {
            lp.frequency = l.frequency
            lp.amplitude = l.amplitude
            lp.computePoints()
          }
          lp.screenId = l.screenId
          state.previewManager.addLine(lp)
        })
        state.previewManager.initSimulation(state.tokens, state.editorManager.data.links, state.starts, state.switches, state.switchLinks, state.transformers, state.arrival, state.inverters, state.screenGates, state.screenTimeMultipliers)
      }
      return { viewMode }
    }),

  setPendingPoint: (point: Point | null) => set(() => ({ pendingPoint: point })),
  setLinePreset: (preset: "arc" | null) => set(() => ({ linePreset: preset })),

})
