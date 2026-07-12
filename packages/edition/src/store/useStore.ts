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
import { createClonerActions } from "./actions/clonerActions"
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
  cloners: {},
  transformers: {},
  inverters: {},
  screenGates: {},
  arrivals: {},
  hoveredLineId: null,
  hoveredStartId: null,
  hoveredSwitchId: null,
  hoveredTransformerId: null,
  hoveredInverterId: null,
  hoveredArrivalId: null,
  hoveredClonerId: null,
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
  mapName: "map.json",
  availableMaps: ["map.json"],
  ...createLineActions(set),
  ...createLinkActions(set),
  ...createModeActions(set),
  ...createStartActions(set),
  ...createSwitchActions(set),
  ...createClonerActions(set),
  ...createTransformerActions(set),
  ...createArrivalActions(set),
  ...createInverterActions(set),
  ...createScreenGateActions(set),
  ...createScreenActions(set),
  ...createMapActions(set),
}))

// Autosave : réécrit packages/maps/<mapName> à chaque changement de la map (dev only).
// Une map différente de la dernière sauvegardée force l'écriture même si le contenu
// coïncide (cas d'une map vide fraîchement créée qui doit quand même toucher le disque).
let saveTimer: ReturnType<typeof setTimeout> | undefined
let lastSaved = ""
let lastSavedMapName = ""
useStore.subscribe((state) => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const json: MapJson = serializeMap(
      state.editorManager, state.starts, state.switches, state.switchLinks,
      state.transformers, state.arrivals, state.inverters, state.screens, state.screenGates, state.screenTimeMultipliers,
      state.cloners,
    )
    const str = JSON.stringify(json)
    if (str === lastSaved && state.mapName === lastSavedMapName) return
    lastSaved = str
    lastSavedMapName = state.mapName
    saveMap(state.mapName, json)
  }, 400)
})

// Chargement initial : liste des maps dispo (GET /__list-maps) puis la map courante
// (GET /__load-map?name=...) via le plugin dev (pas d'import statique → écrire
// le fichier ne déclenche pas de HMR/reload qui réinitialiserait le store).
void fetch("/__list-maps")
  .then((r) => (r.ok ? r.json() : ["map.json"]))
  .then(async (names: string[]) => {
    useStore.getState().setAvailableMaps(names)
    const name = names.includes("map.json") ? "map.json" : (names[0] ?? "map.json")
    const res = await fetch(`/__load-map?name=${encodeURIComponent(name)}`)
    if (!res.ok) return
    const json: MapJson = await res.json()
    lastSaved = JSON.stringify(json)
    lastSavedMapName = name
    useStore.setState({ mapName: name })
    useStore.getState().loadMap(json)
  })
  .catch(() => {})
