import { buildPreviewManager } from "@drift/engine/Map/loadPreview"
import type { MapJson } from "@drift/engine/Map/mapJson"
import { PreviewCanvas } from "@drift/game"
import mapJson from "@drift/maps/map.json"

// Interface de jeu (WIP) : charge la map et la fait tourner.
const previewManager = buildPreviewManager(mapJson as MapJson)

export const App = () => {
  const dpr = window.devicePixelRatio || 1
  return (
    <PreviewCanvas
      previewManager={previewManager}
      dpr={dpr}
      scale={1}
      paused={false}
      visible
    />
  )
}
