import { create } from "zustand"
import { EditorManager } from "@drift/engine/Manager/EditorManager"
import { PreviewManager } from "@drift/engine/Manager/PreviewManager"
import type { LineType } from "@drift/engine/entities/Line/Line"
import { serializeMap, type MapJson } from "@drift/engine/Map/mapJson"
import type { Store } from "./types"
import { createLineActions } from "./actions/lineActions"
import { createLinkActions } from "./actions/linkActions"
import { createModeActions } from "./actions/modeActions"
import { createStartActions } from "./actions/startActions"
import { createSwitchActions } from "./actions/switchActions"
import { createTransformerActions } from "./actions/transformerActions"
import { createArrivalActions } from "./actions/arrivalActions"
import { createInverterActions } from "./actions/inverterActions"
import { createScreenActions } from "./actions/screenActions"
import { createScreenGateActions } from "./actions/screenGateActions"
import { createMapActions } from "./actions/mapActions"
import { saveMap } from "../saveMap"

const editorManager = new EditorManager()
const previewManager = new PreviewManager()
;(window as any).previewManager = previewManager

export const useStore = create<Store>()((set) => ({
  editorManager,
  previewManager,
  starts: {},
  switches: {},
  switchLinks: {},
  transformers: {},
  inverters: {},
  screenGates: {},
  arrival: null,
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
  screens: ["main"],
  currentScreenId: "main",
  screenTimeMultipliers: {},
  ...createLineActions(set),
  ...createLinkActions(set),
  ...createModeActions(set),
  ...createStartActions(set),
  ...createSwitchActions(set),
  ...createTransformerActions(set),
  ...createArrivalActions(set),
  ...createInverterActions(set),
  ...createScreenGateActions(set),
  ...createScreenActions(set),
  ...createMapActions(set),
}))

// Autosave : réécrit packages/maps/map.json à chaque changement de la map (dev only).
let saveTimer: ReturnType<typeof setTimeout> | undefined
let lastSaved = ""
useStore.subscribe((state) => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const json: MapJson = serializeMap(
      state.editorManager, state.starts, state.switches, state.switchLinks,
      state.transformers, state.arrival, state.inverters, state.screens, state.screenGates, state.screenTimeMultipliers,
    )
    const str = JSON.stringify(json)
    if (str === lastSaved) return
    lastSaved = str
    saveMap(json)
  }, 400)
})

// Chargement initial : GET map.json via le plugin dev (pas d'import statique → écrire
// le fichier ne déclenche pas de HMR/reload qui réinitialiserait le store).
void fetch("/__load-map")
  .then((r) => (r.ok ? r.json() : null))
  .then((json: MapJson | null) => {
    if (!json) return
    lastSaved = JSON.stringify(json)
    useStore.getState().loadMap(json)
  })
  .catch(() => {})
