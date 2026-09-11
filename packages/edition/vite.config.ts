import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { readFile, writeFile } from "fs/promises"
import { MAPS_DIR, isMapFile, listMapFiles, writeLevelsIndex } from "../maps/mapFiles.mjs"

const r = (p: string) => path.resolve(__dirname, "../..", p)

// Nom de fichier autorisé : map.json, map2.json, map3.json… jamais de chemin
// (protège /__load-map et /__save-map contre la traversée de répertoire). Même règle que
// les niveaux du jeu (maps/mapFiles.mjs).
const isValidMapName = (name: string): name is string => isMapFile(name)

// Lit / écrit packages/maps/<name>.json côté serveur dev. Plusieurs maps peuvent
// coexister (map.json, map2.json…) ; edition NE les importe PAS statiquement (sinon
// écrire le fichier déclenche un HMR/reload qui réinitialise le store) → liste via
// GET /__list-maps, charge via GET /__load-map?name=…, écrit via POST /__save-map?name=….
// Suppression volontairement non exposée ici : on supprime un fichier à la main.
const saveMapPlugin = (): Plugin => ({
  name: "tic-tac-tic-save-map",
  configureServer(server) {
    server.middlewares.use("/__list-maps", async (_req, res) => {
      try {
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(listMapFiles()))
      } catch (e) {
        res.statusCode = 500
        res.end(String(e))
      }
    })
    server.middlewares.use("/__load-map", async (req, res) => {
      const name = new URL(req.url ?? "", "http://localhost").searchParams.get("name") ?? "map.json"
      if (!isValidMapName(name)) {
        res.statusCode = 400
        res.end("invalid map name")
        return
      }
      try {
        const txt = await readFile(path.join(MAPS_DIR, name), "utf8")
        res.setHeader("Content-Type", "application/json")
        res.end(txt)
      } catch (e) {
        res.statusCode = 500
        res.end(String(e))
      }
    })
    server.middlewares.use("/__save-map", (req, res) => {
      if (req.method !== "POST") {
        res.statusCode = 405
        res.end()
        return
      }
      const name = new URL(req.url ?? "", "http://localhost").searchParams.get("name") ?? "map.json"
      if (!isValidMapName(name)) {
        res.statusCode = 400
        res.end("invalid map name")
        return
      }
      let body = ""
      req.on("data", (chunk) => (body += chunk))
      req.on("end", async () => {
        try {
          await writeFile(path.join(MAPS_DIR, name), body)
          // nouvelle map → elle devient un niveau du jeu (index Metro de l'app)
          writeLevelsIndex()
          res.statusCode = 200
          res.end("ok")
        } catch (e) {
          res.statusCode = 500
          res.end(String(e))
        }
      })
    })
  },
})

export default defineConfig({
  plugins: [react(), saveMapPlugin()],
  // Active les sondes Profiler (onglet perf) — voir engine/src/CLAUDE.md.
  define: { __TICTACTIC_PROFILING__: JSON.stringify(true) },
  resolve: {
    alias: [
      { find: /^@tic-tac-tic\/engine\/(.*)$/, replacement: r("packages/engine/src/$1") },
      { find: /^@tic-tac-tic\/maps\/(.*)$/, replacement: r("packages/maps/$1") },
      { find: /^@tic-tac-tic\/canvas-render$/, replacement: r("packages/canvas-render/src/index.ts") },
      { find: /^@tic-tac-tic\/edition$/, replacement: r("packages/edition/src/index.ts") },
      { find: /^store$/, replacement: r("packages/edition/src/store/index.ts") },
      { find: /^store\/(.*)$/, replacement: r("packages/edition/src/store/$1") },
      { find: /^hooks\/(.*)$/, replacement: r("packages/edition/src/hooks/$1") },
      { find: /^components\/(.*)$/, replacement: r("packages/edition/src/components/$1") },
    ],
  },
})
