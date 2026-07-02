import { deserializeMap, type MapJson } from "@drift/engine/Map/mapJson"
import type { Set } from "store/types"

export const EMPTY_MAP: MapJson = { screens: ["main"], lines: [], links: [], tokens: [], starts: [], switches: {} }

export const createMapActions = (set: Set) => ({
  loadMap: (json: MapJson) =>
    set((state) => {
      const r = deserializeMap(json, state.editorManager)
      return { ...r, currentScreenId: "main", revision: state.revision + 1 }
    }),
})
