import { LineEditor } from "engine/Line/LineEditor"
import type { LineType } from "engine/Line/Line"
import type { Point } from "engine/types"
import type { Set } from "store/types"

export const createLineActions = (set: Set) => ({
  addLine: (line: LineEditor) =>
    set((state) => {
      state.editorManager.addLine(line)
      return { revision: state.revision + 1 }
    }),

  removeLine: (id: string) =>
    set((state) => {
      state.editorManager.removeLine(id)
      return { revision: state.revision + 1 }
    }),

  updateLineEndpoint: (id: string, endpoint: "start" | "end", point: Point) =>
    set((state) => {
      const line = state.editorManager.data.lines[id]
      if (!line) return {}
      if (endpoint === "start") line.start = { ...point }
      else line.end = { ...point }
      line.computePoints()
      state.editorManager.refreshLinksForEndpoint(id, endpoint)
      return { revision: state.revision + 1 }
    }),

  updateLineControlPoint: (id: string, cp: "cp1" | "cp2", point: Point) =>
    set((state) => {
      const line = state.editorManager.data.lines[id]
      if (!line) return {}
      line[cp] = { ...point }
      line.computePoints()
      return { revision: state.revision + 1 }
    }),

  setLineType: (lineType: LineType) => set(() => ({ lineType })),
})
