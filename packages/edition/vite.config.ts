import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { readFile, writeFile } from "fs/promises"

const r = (p: string) => path.resolve(__dirname, "../..", p)
const MAP_PATH = r("packages/maps/map.json")

// Lit / écrit packages/maps/map.json côté serveur dev.
// edition NE l'importe PAS (sinon écrire le fichier déclenche un HMR/reload
// qui réinitialise le store) → charge via GET /__load-map, écrit via POST /__save-map.
const saveMapPlugin = (): Plugin => ({
  name: "drift-save-map",
  configureServer(server) {
    server.middlewares.use("/__load-map", async (_req, res) => {
      try {
        const txt = await readFile(MAP_PATH, "utf8")
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
      let body = ""
      req.on("data", (chunk) => (body += chunk))
      req.on("end", async () => {
        try {
          await writeFile(MAP_PATH, body)
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
  resolve: {
    alias: [
      { find: /^@drift\/engine\/(.*)$/, replacement: r("packages/engine/src/$1") },
      { find: /^@drift\/maps\/(.*)$/, replacement: r("packages/maps/$1") },
      { find: /^@drift\/game$/, replacement: r("packages/game/src/index.ts") },
      { find: /^@drift\/edition$/, replacement: r("packages/edition/src/index.ts") },
      { find: /^store$/, replacement: r("packages/edition/src/store/index.ts") },
      { find: /^store\/(.*)$/, replacement: r("packages/edition/src/store/$1") },
      { find: /^hooks\/(.*)$/, replacement: r("packages/edition/src/hooks/$1") },
      { find: /^components\/(.*)$/, replacement: r("packages/edition/src/components/$1") },
    ],
  },
})
