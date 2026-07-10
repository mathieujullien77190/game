import { deserializeMap, type MapJson } from "@drift/engine/Map/mapJson"
import type { Set } from "store/types"

export const EMPTY_MAP: MapJson = { screens: ["main"], lines: [], links: [], starts: [], switches: {} }

const nextMapName = (existing: string[]) => {
  const max = existing.reduce((m, name) => {
    const match = name.match(/^map(\d+)\.json$/)
    return match ? Math.max(m, parseInt(match[1], 10)) : m
  }, 1)
  return `map${max + 1}.json`
}

export const createMapActions = (set: Set) => ({
  loadMap: (json: MapJson) =>
    set((state) => {
      const r = deserializeMap(json, state.editorManager)
      return { ...r, currentScreenId: "main", revision: state.revision + 1 }
    }),

  setAvailableMaps: (names: string[]) => set(() => ({ availableMaps: names })),

  switchMap: async (name: string) => {
    const res = await fetch(`/__load-map?name=${encodeURIComponent(name)}`)
    const json: MapJson | null = res.ok ? await res.json() : null
    set((state) => {
      const r = deserializeMap(json ?? EMPTY_MAP, state.editorManager)
      return { ...r, currentScreenId: "main", mapName: name, revision: state.revision + 1 }
    })
  },

  createMap: () =>
    set((state) => {
      const name = nextMapName(state.availableMaps)
      const r = deserializeMap(EMPTY_MAP, state.editorManager)
      return {
        ...r,
        currentScreenId: "main",
        mapName: name,
        availableMaps: [...state.availableMaps, name],
        revision: state.revision + 1,
      }
    }),
})
