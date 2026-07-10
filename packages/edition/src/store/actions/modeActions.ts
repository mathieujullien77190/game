import { populatePreviewLines } from "@drift/engine/Map/loadPreview"
import type { Point } from "@drift/engine/types"
import type { Mode, ViewMode, Set } from "store/types"

export const createModeActions = (set: Set) => ({
  setMode: (mode: Mode) => set(() => ({ mode })),

  setViewMode: (viewMode: ViewMode) =>
    set((state) => {
      if (viewMode === "preview") {
        populatePreviewLines(state.previewManager, state.editorManager)
        state.previewManager.initSimulation(state.editorManager.data.links, state.starts, state.switches, state.switchLinks, state.transformers, state.arrival, state.inverters, state.screenGates, state.screenTimeMultipliers)
      }
      return { viewMode }
    }),

  setPendingPoint: (point: Point | null) => set(() => ({ pendingPoint: point })),
  setLinePreset: (preset: "arc" | null) => set(() => ({ linePreset: preset })),

})
