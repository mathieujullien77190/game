import { EditorManager } from "../Manager/EditorManager"
import { PreviewManager } from "../Manager/PreviewManager"
import { LinePreview } from "../entities/Line/LinePreview"
import { deserializeMap, type MapJson } from "./mapJson"

// Reconstruit les LinePreview de la simulation à partir des LineEditor d'un EditorManager.
// Partagé entre l'aperçu de l'éditeur (edition) et le chargement d'une map (game/app).
export const populatePreviewLines = (pm: PreviewManager, em: EditorManager) => {
  pm.data.lines = {}
  Object.values(em.data.lines).forEach((l) => {
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
    pm.addLine(lp)
  })
}

// Charge une MapJson dans un PreviewManager prêt à simuler (game/app).
export const buildPreviewManager = (json: MapJson): PreviewManager => {
  const em = new EditorManager()
  const { starts, switches, switchLinks, transformers, arrival, inverters, screenGates, screenTimeMultipliers } =
    deserializeMap(json, em)

  const pm = new PreviewManager()
  populatePreviewLines(pm, em)
  pm.initSimulation(
    em.data.links, starts, switches, switchLinks,
    transformers, arrival, inverters, screenGates, screenTimeMultipliers,
  )
  return pm
}
