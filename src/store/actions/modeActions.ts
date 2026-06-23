import { LinePreview } from "engine/Line/LinePreview"
import type { Point } from "engine/types"
import type { Mode, ViewMode, Set } from "store/types"

export const createModeActions = (set: Set) => ({
  setMode: (mode: Mode) => set(() => ({ mode })),

  setViewMode: (viewMode: ViewMode) =>
    set((state) => {
      if (viewMode === "preview") {
        state.previewManager.data.lines = {}
        Object.values(state.editorManager.data.lines).forEach((l) =>
          state.previewManager.addLine(new LinePreview(l.start, l.end, l.type, l.id, l.cp1, l.cp2))
        )
        state.previewManager.initSimulation(state.tokens, state.editorManager.data.links, state.starts, state.switches, state.switchLinks)
      }
      return { viewMode }
    }),

  setPendingPoint: (point: Point | null) => set(() => ({ pendingPoint: point })),
})
