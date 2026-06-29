import { create } from "zustand"
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

let _currentMapId = "default"
let _saveTimer: ReturnType<typeof setTimeout> | null = null
let _lastSaveKey = ""

const makeEmptyEditorState = () => {
  const em = new EditorManager()
  const pm = new PreviewManager()
  ;(window as any).previewManager = pm
  return { editorManager: em, previewManager: pm }
}

const loadMapFromFile = async (id: string): Promise<MapJson> => {
  try {
    const res = await fetch(`/maps/${id}.json`)
    if (!res.ok) return EMPTY_MAP
    return await res.json()
  } catch { return EMPTY_MAP }
}

const saveToFile = (mapId: string, state: Store) => {
  const json = serializeMap(state.editorManager, state.tokens, state.starts, state.switches, state.switchLinks, state.transformers, state.arrival, state.inverters, state.screens, state.screenGates, state.screenTimeMultipliers, state.helps)
  fetch("/api/save-map", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: mapId, data: json, mapList: state.mapList, mapDifficulties: state.mapDifficulties, mapStarThresholds: state.mapStarThresholds }),
  })
}

const scheduleAutoSave = (state: Store) => {
  if (_saveTimer) clearTimeout(_saveTimer)
  _saveTimer = setTimeout(() => {
    const json = serializeMap(state.editorManager, state.tokens, state.starts, state.switches, state.switchLinks, state.transformers, state.arrival, state.inverters, state.screens, state.screenGates, state.screenTimeMultipliers, state.helps)
    const key = `${_currentMapId}:${JSON.stringify(json)}:${JSON.stringify(state.mapDifficulties)}:${JSON.stringify(state.mapStarThresholds)}`
    if (key === _lastSaveKey) return
    _lastSaveKey = key
    fetch("/api/save-map", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: _currentMapId, data: json, mapList: state.mapList, mapDifficulties: state.mapDifficulties, mapStarThresholds: state.mapStarThresholds }),
    })
  }, 800)
}

const RESET_UI = {
  hoveredLineId: null, hoveredSwitchId: null, hoveredTransformerId: null,
  hoveredInverterId: null, hoveredScreenGateId: null, selectedHelpId: null,
  currentScreenId: "main" as const, mode: "select" as const,
  pendingPoint: null, snapPoint: null,
}

const loadMapIntoState = async (id: string) => {
  const { editorManager, previewManager } = makeEmptyEditorState()
  const json = await loadMapFromFile(id)
  const deserialized = deserializeMap(json, editorManager)
  return { editorManager, previewManager, ...deserialized }
}

const { editorManager: initEm, previewManager: initPm } = makeEmptyEditorState()

export const useStore = create<Store>()((set, get) => ({
  initialized: false,
  editorManager: initEm,
  previewManager: initPm,
  tokens: {},
  starts: {},
  switches: {},
  switchLinks: {},
  transformers: {},
  inverters: {},
  arrival: null,
  screenGates: {},
  helps: {},
  selectedHelpId: null,
  screens: ["main"],
  screenTimeMultipliers: {},
  hoveredLineId: null,
  hoveredSwitchId: null,
  hoveredTransformerId: null,
  hoveredInverterId: null,
  hoveredScreenGateId: null,
  revision: 0,
  mode: "select",
  viewMode: "editor",
  pendingPoint: null,
  pendingTransformerType: "color",
  lineType: "straight" as LineType,
  linePreset: null,
  currentScreenId: "main",
  mapList: [],
  currentMapId: "default",
  mapDifficulties: {},
  mapStarThresholds: {},

  init: async () => {
    let mapList = ["default"]
    let mapDifficulties: Record<string, MapDifficulty> = { default: "Tutorial" }
    let mapStarThresholds: Record<string, { star1: number; star2: number; star3: number }> = {}
    let currentMapId = "default"

    try {
      const res = await fetch("/maps/_index.json")
      if (res.ok) {
        const index = await res.json()
        if (Array.isArray(index) && index.length > 0) {
          mapList = index.map((e: { id: string }) => e.id)
          mapDifficulties = Object.fromEntries(index.map((e: { id: string; difficulty: string }) => [e.id, e.difficulty as MapDifficulty]))
          mapStarThresholds = Object.fromEntries(index.map((e: { id: string; star1: number; star2: number; star3: number }) => [e.id, { star1: e.star1 ?? 180, star2: e.star2 ?? 120, star3: e.star3 ?? 60 }]))
          currentMapId = mapList[0]
        }
      }
    } catch { /* use defaults */ }

    _currentMapId = currentMapId
    const loaded = await loadMapIntoState(currentMapId)

    set({
      initialized: true,
      ...loaded, ...RESET_UI,
      mapList, currentMapId, mapDifficulties, mapStarThresholds,
      revision: 0, viewMode: "editor", pendingTransformerType: "color",
      lineType: "straight" as LineType, linePreset: null,
    })
  },

  setMapDifficulty: (difficulty) => set((state) => {
    const updated = { ...state.mapDifficulties, [state.currentMapId]: difficulty }
    return { mapDifficulties: updated }
  }),

  setMapStarThresholds: (thresholds) => set((state) => {
    const updated = { ...state.mapStarThresholds, [state.currentMapId]: thresholds }
    return { mapStarThresholds: updated }
  }),

  addMap: () => {
    const state = get()
    let n = 1
    while (state.mapList.includes(`map${n}`)) n++
    const newId = `map${n}`
    const newList = [...state.mapList, newId]
    const diffs = { ...state.mapDifficulties, [newId]: "Tutorial" as MapDifficulty }
    _currentMapId = newId
    const { editorManager, previewManager } = makeEmptyEditorState()
    const deserialized = deserializeMap(EMPTY_MAP, editorManager)
    set({
      ...deserialized, ...RESET_UI, editorManager, previewManager,
      mapList: newList, currentMapId: newId, mapDifficulties: diffs,
      mapStarThresholds: state.mapStarThresholds, revision: state.revision + 1,
      viewMode: "editor", pendingTransformerType: "color", lineType: "straight" as LineType, linePreset: null,
    })
    fetch("/api/save-map", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newId, data: EMPTY_MAP, mapList: newList, mapDifficulties: diffs, mapStarThresholds: state.mapStarThresholds }),
    })
  },

  selectMap: (id) => {
    const state = get()
    if (id === state.currentMapId) return
    if (_saveTimer) clearTimeout(_saveTimer)
    saveToFile(state.currentMapId, state)
    loadMapIntoState(id).then((loaded) => {
      _currentMapId = id
      _lastSaveKey = ""
      set({
        ...loaded, ...RESET_UI, currentMapId: id,
        mapList: state.mapList, mapDifficulties: state.mapDifficulties,
        mapStarThresholds: state.mapStarThresholds, revision: state.revision + 1,
        viewMode: "editor", pendingTransformerType: "color", lineType: "straight" as LineType, linePreset: null,
      })
    })
  },

  clearCurrentMap: () => {
    const state = get()
    const { editorManager, previewManager } = makeEmptyEditorState()
    const deserialized = deserializeMap(EMPTY_MAP, editorManager)
    set({
      ...deserialized, ...RESET_UI, editorManager, previewManager,
      currentMapId: state.currentMapId, mapList: state.mapList,
      mapDifficulties: state.mapDifficulties, mapStarThresholds: state.mapStarThresholds,
      revision: state.revision + 1, viewMode: "editor", pendingTransformerType: "color",
      lineType: "straight" as LineType, linePreset: null,
    })
  },

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
}))

useStore.subscribe((state) => {
  if (!state.initialized) return
  scheduleAutoSave(state)
})
