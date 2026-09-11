// Source unique de « quelles maps sont des niveaux » : tout packages/maps/map*.json, dans l'ordre
// naturel (map.json, map2.json, map3.json… map10.json). Utilisé par :
//   - edition/vite.config.ts : noms autorisés + régénère l'index quand une map est écrite ;
//   - app/webview/vite.config.ts : injecte les niveaux en dev (`yarn app:web`) ;
//   - app (Metro) via l'index généré levels.gen.ts (Metro n'accepte que des imports statiques).
// CLI : `node packages/maps/mapFiles.mjs` régénère levels.gen.ts (lancé avant `yarn app`).

import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

export const MAPS_DIR = path.dirname(fileURLToPath(import.meta.url))
export const MAP_NAME_RE = /^map(\d*)\.json$/
export const INDEX_FILE = "levels.gen.ts"

const rank = (file) => {
  const n = MAP_NAME_RE.exec(file)?.[1] ?? ""
  return n === "" ? 1 : Number(n)
}

export const isMapFile = (file) => MAP_NAME_RE.test(file)

export const listMapFiles = (dir = MAPS_DIR) =>
  readdirSync(dir)
    .filter(isMapFile)
    .sort((a, b) => rank(a) - rank(b))

const indexSource = (files) => {
  const ids = files.map((f) => f.replace(/\.json$/, ""))
  return [
    "// AUTO-GÉNÉRÉ par packages/maps/mapFiles.mjs — ne pas éditer à la main.",
    "// Tous les packages/maps/map*.json, dans l'ordre. Régénéré par l'éditeur quand il écrit une",
    "// map et avant `yarn app` / `yarn app:start` (cf. packages/app/package.json).",
    ...ids.map((id) => `import ${id} from "./${id}.json"`),
    "",
    "export const LEVELS = [",
    ...ids.map((id) => `  { id: "${id}", json: ${id} },`),
    "]",
    "",
  ].join("\n")
}

// Réécrit levels.gen.ts si la liste des maps a changé. Renvoie true s'il a été réécrit.
export const writeLevelsIndex = (dir = MAPS_DIR) => {
  const target = path.join(dir, INDEX_FILE)
  const next = indexSource(listMapFiles(dir))
  if (existsSync(target) && readFileSync(target, "utf8") === next) return false
  writeFileSync(target, next)
  return true
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const changed = writeLevelsIndex()
  console.log(`${INDEX_FILE} ${changed ? "régénéré" : "à jour"} (${listMapFiles().join(", ")})`)
}
