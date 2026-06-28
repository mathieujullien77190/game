import { create } from "zustand"
import { EditorManager } from "engine/Manager/EditorManager"
import { PreviewManager } from "engine/Manager/PreviewManager"
import { LinePreview } from "engine/Line/LinePreview"
import { deserializeMap, type MapJson } from "engine/mapJson"

const EMPTY_MAP: MapJson = { lines: [], links: [], tokens: [], starts: [], switches: {} }

const buildPreviewManager = (json: MapJson): PreviewManager => {
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

  return previewManager
}

type GameStore = {
  previewManager: PreviewManager | null
  loading: boolean
}

export const useGameStore = create<GameStore>(() => ({
  previewManager: null,
  loading: false,
}))

export const loadMap = async (file: string) => {
  useGameStore.setState({ loading: true, previewManager: null })
  let json: MapJson = EMPTY_MAP
  try {
    const res = await fetch(`/maps/${file}`)
    if (res.ok) json = await res.json()
  } catch {}
  useGameStore.setState({ previewManager: buildPreviewManager(json), loading: false })
}
