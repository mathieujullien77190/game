import { create } from "zustand"
import { persist } from "zustand/middleware"
import { EditorManager } from "engine/Manager/EditorManager"
import { PreviewManager } from "engine/Manager/PreviewManager"
import type { LineType } from "engine/Line/Line"
import type { Store, MapDifficulty } from "./types"
import { createLineActions } from "./actions/lineActions"
import { createLinkActions } from "./actions/linkActions"
import { createTokenActions } from "./actions/tokenActions"
import { createModeActions } from "./actions/modeActions"
import { createStartActions } from "./actions/startActions"
import { createSwitchActions } from "./actions/switchActions"
import { createTransformerActions } from "./actions/transformerActions"
import { createArrivalActions } from "./actions/arrivalActions"
import { createInverterActions } from "./actions/inverterActions"
import { createScreenActions } from "./actions/screenActions"
import { createScreenGateActions } from "./actions/screenGateActions"
import { createHelpActions } from "./actions/helpActions"
import { serializeMap, deserializeMap, type MapJson } from "engine/mapJson"

const EMPTY_MAP: MapJson = { lines: [], links: [], tokens: [], starts: [], switches: {} }
const MAP_LIST_KEY = "game2-map-list"
const MAP_CURRENT_KEY = "game2-map-current"
const MAP_DIFFICULTIES_KEY = "game2-map-difficulties"
const MAP_STARS_KEY = "game2-map-stars"
const MAP_STORAGE_PREFIX = "game2-map"

const loadMapDifficulties = (): Record<string, MapDifficulty> => {
  try { return JSON.parse(localStorage.getItem(MAP_DIFFICULTIES_KEY) || "{}") } catch { return {} }
}

const loadMapStarThresholds = (): Record<string, { star1: number; star2: number; star3: number }> => {
  try { return JSON.parse(localStorage.getItem(MAP_STARS_KEY) || "{}") } catch { return {} }
}

const loadMapList = (): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(MAP_LIST_KEY) || "[]")
    return Array.isArray(v) && v.length > 0 ? v : ["map1"]
  } catch { return ["map1"] }
}

const loadMapJson = (id: string): MapJson => {
  try {
    const v = localStorage.getItem(`${MAP_STORAGE_PREFIX}-${id}`)
    return v ? JSON.parse(v) : EMPTY_MAP
  } catch { return EMPTY_MAP }
}

let _currentMapId = (() => {
  const saved = localStorage.getItem(MAP_CURRENT_KEY) ?? "map1"
  const list = loadMapList()
  return list.includes(saved) ? saved : list[0]
})()

const mapStorage = {
  getItem: (_name: string) => {
    const str = localStorage.getItem(`${MAP_STORAGE_PREFIX}-${_currentMapId}`)
    if (!str) return { state: EMPTY_MAP, version: 0 }
    try { return { state: JSON.parse(str) as MapJson, version: 0 } }
    catch { return { state: EMPTY_MAP, version: 0 } }
  },
  setItem: (_name: string, value: { state: unknown }) => {
    localStorage.setItem(`${MAP_STORAGE_PREFIX}-${_currentMapId}`, JSON.stringify(value.state))
  },
  removeItem: (_name: string) => {
    localStorage.removeItem(`${MAP_STORAGE_PREFIX}-${_currentMapId}`)
  },
}

const makeEmptyEditorState = () => {
  const em = new EditorManager()
  const pm = new PreviewManager()
  ;(window as any).previewManager = pm
  return { editorManager: em, previewManager: pm }
}

const loadMapIntoState = (id: string) => {
  const { editorManager, previewManager } = makeEmptyEditorState()
  const json = loadMapJson(id)
  const { tokens, starts, switches, switchLinks, transformers, inverters, arrival, screens, screenGates, screenTimeMultipliers, helps } =
    deserializeMap(json, editorManager)
  return { editorManager, previewManager, tokens, starts, switches, switchLinks, transformers, inverters, arrival, screens, screenGates, screenTimeMultipliers, helps }
}

const RESET_UI = {
  hoveredLineId: null, hoveredSwitchId: null, hoveredTransformerId: null,
  hoveredInverterId: null, hoveredScreenGateId: null, selectedHelpId: null,
  currentScreenId: "main" as const, mode: "select" as const,
  pendingPoint: null, snapPoint: null,
}

const initialMapList = loadMapList()
const initialMapDifficulties = loadMapDifficulties()
const initialMapStarThresholds = loadMapStarThresholds()
const initialEditorState = loadMapIntoState(_currentMapId)
const editorManager = initialEditorState.editorManager
const previewManager = initialEditorState.previewManager
;(window as any).previewManager = previewManager

export const useStore = create<Store>()(
  persist(
    (set) => ({
      editorManager,
      previewManager,
      tokens: initialEditorState.tokens,
      starts: initialEditorState.starts,
      switches: initialEditorState.switches,
      switchLinks: initialEditorState.switchLinks,
      transformers: initialEditorState.transformers,
      inverters: initialEditorState.inverters,
      screenGates: initialEditorState.screenGates,
      helps: initialEditorState.helps,
      selectedHelpId: null,
      arrival: initialEditorState.arrival,
      screens: initialEditorState.screens,
      screenTimeMultipliers: initialEditorState.screenTimeMultipliers,
      hoveredLineId: null,
      hoveredSwitchId: null,
      hoveredTransformerId: null,
      hoveredInverterId: null,
      hoveredScreenGateId: null,
      revision: 0,
      mode: "select",
      viewMode: "editor",
      pendingPoint: null,
      pendingTransformerType: "color" as const,
      lineType: "straight" as LineType,
      linePreset: null as ("arc" | null),
      currentScreenId: "main",
      mapList: initialMapList,
      currentMapId: _currentMapId,
      mapDifficulties: initialMapDifficulties,
      mapStarThresholds: initialMapStarThresholds,

      setMapDifficulty: (difficulty: MapDifficulty) => set((state) => {
        const updated = { ...state.mapDifficulties, [state.currentMapId]: difficulty }
        localStorage.setItem(MAP_DIFFICULTIES_KEY, JSON.stringify(updated))
        return { mapDifficulties: updated }
      }),

      setMapStarThresholds: (thresholds) => set((state) => {
        const updated = { ...state.mapStarThresholds, [state.currentMapId]: thresholds }
        localStorage.setItem(MAP_STARS_KEY, JSON.stringify(updated))
        return { mapStarThresholds: updated }
      }),

      addMap: () => set((state) => {
        let n = 1
        while (state.mapList.includes(`map${n}`)) n++
        const newId = `map${n}`
        const newList = [...state.mapList, newId]
        localStorage.setItem(MAP_LIST_KEY, JSON.stringify(newList))
        localStorage.setItem(MAP_CURRENT_KEY, newId)
        localStorage.setItem(`${MAP_STORAGE_PREFIX}-${newId}`, JSON.stringify(EMPTY_MAP))
        _currentMapId = newId
        const diffs = { ...state.mapDifficulties, [newId]: "Tutorial" as MapDifficulty }
        localStorage.setItem(MAP_DIFFICULTIES_KEY, JSON.stringify(diffs))
        const loaded = loadMapIntoState(newId)
        return { ...loaded, ...RESET_UI, mapList: newList, currentMapId: newId, mapDifficulties: diffs, mapStarThresholds: state.mapStarThresholds, revision: state.revision + 1, viewMode: "editor", pendingTransformerType: "color", lineType: "straight" as LineType, linePreset: null }
      }),

      selectMap: (id: string) => set((state) => {
        if (id === state.currentMapId) return {}
        localStorage.setItem(MAP_CURRENT_KEY, id)
        _currentMapId = id
        const loaded = loadMapIntoState(id)
        return { ...loaded, ...RESET_UI, currentMapId: id, mapList: state.mapList, mapDifficulties: state.mapDifficulties, mapStarThresholds: state.mapStarThresholds, revision: state.revision + 1, viewMode: "editor", pendingTransformerType: "color", lineType: "straight" as LineType, linePreset: null }
      }),

      clearCurrentMap: () => set((state) => {
        localStorage.setItem(`${MAP_STORAGE_PREFIX}-${state.currentMapId}`, JSON.stringify(EMPTY_MAP))
        const loaded = loadMapIntoState(state.currentMapId)
        return { ...loaded, ...RESET_UI, currentMapId: state.currentMapId, mapList: state.mapList, mapDifficulties: state.mapDifficulties, mapStarThresholds: state.mapStarThresholds, revision: state.revision + 1, viewMode: "editor", pendingTransformerType: "color", lineType: "straight" as LineType, linePreset: null }
      }),

      ...createLineActions(set),
      ...createLinkActions(set),
      ...createTokenActions(set),
      ...createModeActions(set),
      ...createStartActions(set),
      ...createSwitchActions(set),
      ...createTransformerActions(set),
      ...createArrivalActions(set),
      ...createInverterActions(set),
      ...createScreenGateActions(set),
      ...createScreenActions(set),
      ...createHelpActions(set),
    }),
    {
      name: MAP_STORAGE_PREFIX,
      storage: mapStorage as any,
      partialize: (state) =>
        serializeMap(state.editorManager, state.tokens, state.starts, state.switches, state.switchLinks, state.transformers, state.arrival, state.inverters, state.screens, state.screenGates, state.screenTimeMultipliers, state.helps) as any,
      merge: (_persisted, current) => current,
    }
  )
)
