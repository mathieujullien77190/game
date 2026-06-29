import { create } from "zustand"
import { EditorManager } from "engine/Manager/EditorManager"
import { PreviewManager } from "engine/Manager/PreviewManager"
import { LinePreview } from "engine/Line/LinePreview"
import { deserializeMap, type MapJson } from "engine/mapJson"
import type { Help } from "engine/Help/Help"
import { getMapData } from "maps"

const EMPTY_MAP: MapJson = { lines: [], links: [], tokens: [], starts: [], switches: {} }

const buildPreviewManager = (json: MapJson) => {
  const editorManager = new EditorManager()
  const previewManager = new PreviewManager()

  const {
    tokens,
    starts,
    switches,
    switchLinks,
    transformers,
    inverters,
    arrival,
    screenGates,
    screenTimeMultipliers,
    helps,
  } = deserializeMap(json, editorManager)

  previewManager.data.lines = {}
  for (const l of Object.values(editorManager.data.lines)) {
    const lp = new LinePreview(l.start, l.end, l.type, l.id, l.cp1, l.cp2)
    lp.boost = l.boost
    lp.tunnel = l.tunnel
    lp.showSpeed = l.showSpeed
    lp.limitation = l.limitation
    if (l.type === "sine") {
      lp.frequency = l.frequency
      lp.amplitude = l.amplitude
      lp.computePoints()
    }
    if (l.type === "elbow" && l.flip) {
      lp.flip = true
      lp.computePoints()
    }
    if (l.type === "spiral") {
      lp.turns = l.turns
      lp.computePoints()
    }
    lp.screenId = l.screenId
    previewManager.addLine(lp)
  }

  previewManager.initSimulation(
    tokens,
    editorManager.data.links,
    starts,
    switches,
    switchLinks,
    transformers,
    arrival,
    inverters,
    screenGates,
    screenTimeMultipliers
  )

  return { previewManager, helps: Object.values(helps) }
}

type GameStore = {
  previewManager: PreviewManager | null
  loading: boolean
  helps: Help[]
}

export const useGameStore = create<GameStore>(() => ({
  previewManager: null,
  loading: false,
  helps: [],
}))

export const loadMap = (file: string) => {
  useGameStore.setState({ loading: true, previewManager: null, helps: [] })
  try {
    const json = getMapData(file) ?? EMPTY_MAP
    const { previewManager, helps } = buildPreviewManager(json)
    useGameStore.setState({ previewManager, helps, loading: false })
  } catch (e) {
    console.error(`loadMap failed for "${file}":`, e)
    const { previewManager, helps } = buildPreviewManager(EMPTY_MAP)
    useGameStore.setState({ previewManager, helps, loading: false })
  }
}
