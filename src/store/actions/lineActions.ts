import { LineEditor } from "engine/Line/LineEditor"
import type { LineType } from "engine/Line/Line"
import { SwitchEditor } from "engine/Switch/SwitchEditor"
import { getSwitchEnterPoint } from "engine/Switch/switchUtils"
import type { Link } from "engine/Link/Link"
import type { Point } from "engine/types"
import type { Set } from "store/types"

const syncSwitches = (
  switches: Record<string, SwitchEditor>,
  links: Record<string, Link>
): Record<string, SwitchEditor> => {
  const updated = { ...switches }
  let changed = false

  for (const [swId, sw] of Object.entries(updated)) {
    const ep = getSwitchEnterPoint(sw.linkIds, links)
    if (!ep) {
      delete updated[swId]
      changed = true
      continue
    }

    const linksAtEnter = Object.values(links)
      .filter(
        (lk) =>
          (lk.line1.lineId === ep.lineId && lk.line1.endpoint === ep.endpoint) ||
          (lk.line2.lineId === ep.lineId && lk.line2.endpoint === ep.endpoint)
      )
      .map((lk) => lk.id)

    const same =
      linksAtEnter.length === sw.linkIds.length &&
      linksAtEnter.every((id) => sw.linkIds.includes(id))

    if (!same) {
      const newActive =
        sw.activeLinkId && linksAtEnter.includes(sw.activeLinkId)
          ? sw.activeLinkId
          : linksAtEnter[0] ?? null
      updated[swId] = new SwitchEditor(sw.id, linksAtEnter, newActive)
      changed = true
    }
  }

  return changed ? updated : switches
}

export const createLineActions = (set: Set) => ({
  addLine: (line: LineEditor) =>
    set((state) => {
      state.editorManager.addLine(line)
      const switches = syncSwitches(state.switches, state.editorManager.data.links)
      return { revision: state.revision + 1, switches }
    }),

  removeLine: (id: string) =>
    set((state) => {
      state.editorManager.removeLine(id)
      const switches = syncSwitches(state.switches, state.editorManager.data.links)
      return { revision: state.revision + 1, switches }
    }),

  updateLineEndpoint: (id: string, endpoint: "start" | "end", point: Point) =>
    set((state) => {
      const line = state.editorManager.data.lines[id]
      if (!line) return {}
      if (endpoint === "start") line.start = { ...point }
      else line.end = { ...point }
      line.computePoints()
      state.editorManager.refreshLinksForEndpoint(id, endpoint)
      const switches = syncSwitches(state.switches, state.editorManager.data.links)
      return { revision: state.revision + 1, switches }
    }),

  updateLineControlPoint: (id: string, cp: "cp1" | "cp2", point: Point) =>
    set((state) => {
      const line = state.editorManager.data.lines[id]
      if (!line) return {}
      line[cp] = { ...point }
      line.computePoints()
      return { revision: state.revision + 1 }
    }),

  updateLineBoost: (id: string, boost: number) =>
    set((state) => {
      const line = state.editorManager.data.lines[id]
      if (!line) return {}
      line.boost = boost
      return { revision: state.revision + 1 }
    }),

  updateLineSine: (id: string, frequency: number, amplitude: number) =>
    set((state) => {
      const line = state.editorManager.data.lines[id]
      if (!line) return {}
      line.frequency = frequency
      line.amplitude = amplitude
      line.computePoints()
      return { revision: state.revision + 1 }
    }),

  updateLineTunnel: (id: string, tunnel: boolean) =>
    set((state) => {
      const line = state.editorManager.data.lines[id]
      if (!line) return {}
      line.tunnel = tunnel
      return { revision: state.revision + 1 }
    }),

  updateLineShowSpeed: (id: string, showSpeed: boolean) =>
    set((state) => {
      const line = state.editorManager.data.lines[id]
      if (!line) return {}
      line.showSpeed = showSpeed
      return { revision: state.revision + 1 }
    }),

  updateLineLimitation: (id: string, limitation: number) =>
    set((state) => {
      const line = state.editorManager.data.lines[id]
      if (!line) return {}
      line.limitation = limitation
      return { revision: state.revision + 1 }
    }),

  setHoveredLineId: (id: string | null) => set(() => ({ hoveredLineId: id })),

  setLineType: (lineType: LineType) => set(() => ({ lineType })),
})
